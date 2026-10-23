import { randomUUID } from "node:crypto";
import { and, asc, eq } from "drizzle-orm";
import { Type } from "@google/genai";
import { bookings, destinations, travelers } from "../db/schema.js";

const formatPrice = (value) => `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
const formatRef = (id) => `WOI-${String(id).padStart(6, "0")}`;
const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const unitPrice = (destination) => destination.discountedPrice ?? destination.price ?? 0;

const NOT_SIGNED_IN = { error: "The user is not signed in, so bookings are not available." };

export const TOOL_DECLARATIONS = [
  {
    name: "list_my_bookings",
    description:
      "Lists the signed-in user's recent bookings with their reference, status, package, boarding station, travel date and total. Call this before changing or cancelling a booking unless the user already named it exactly.",
  },
  {
    name: "list_destinations",
    description:
      "Lists the bookable packages with their numeric id, title, locations and price per person. Use it to find the id of a package the user wants to switch to.",
  },
  {
    name: "propose_change_trip",
    description:
      "Prepares a change to a confirmed booking's boarding station and/or package. This does NOT change anything: it shows the user a confirmation card they must approve. Provide only the fields that change.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        booking: {
          type: Type.STRING,
          description: "The booking reference, like WOI-000012, or its number.",
        },
        newFromCity: {
          type: Type.STRING,
          description: "The new boarding station or city. Omit if it is not changing.",
        },
        newDestinationId: {
          type: Type.INTEGER,
          description: "The id of the new package from list_destinations. Omit if it is not changing.",
        },
      },
      required: ["booking"],
    },
  },
  {
    name: "propose_cancel_booking",
    description:
      "Prepares the cancellation of a confirmed booking. This does NOT cancel anything: it shows the user a confirmation card they must approve.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        booking: {
          type: Type.STRING,
          description: "The booking reference, like WOI-000012, or its number.",
        },
      },
      required: ["booking"],
    },
  },
];

async function loadOwnBooking(db, userId, bookingArg) {
  const match = String(bookingArg ?? "").match(/\d+/);
  const id = match ? Number(match[0]) : NaN;

  if (!Number.isSafeInteger(id) || id <= 0) {
    return { error: "That is not a valid booking reference. Ask the user which booking they mean." };
  }

  const [booking] = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.id, id), eq(bookings.userId, userId)));

  if (!booking) {
    return { error: `No booking ${formatRef(id)} was found on this user's account.` };
  }

  const [destinationRows, travelerRows] = await Promise.all([
    db
      .select({
        id: destinations.id,
        title: destinations.title,
        price: destinations.price,
        discountedPrice: destinations.discountedPrice,
      })
      .from(destinations)
      .where(eq(destinations.id, booking.destinationId)),
    db.select({ id: travelers.id }).from(travelers).where(eq(travelers.bookingId, id)),
  ]);

  return {
    booking,
    destination: destinationRows[0],
    travelerCount: Math.max(travelerRows.length, 1),
  };
}

function registerAction(ctx, action) {
  ctx.actions = ctx.actions.filter(
    (a) => !(a.bookingId === action.bookingId && a.type === action.type)
  );
  ctx.actions.push(action);
}

async function listMyBookings({ db, user }) {
  if (!user) return NOT_SIGNED_IN;

  const rows = await db
    .select({
      id: bookings.id,
      status: bookings.status,
      fromCity: bookings.fromCity,
      travelDate: bookings.travelDate,
      totalPrice: bookings.totalPrice,
      destinationId: bookings.destinationId,
      title: destinations.title,
    })
    .from(bookings)
    .innerJoin(destinations, eq(bookings.destinationId, destinations.id))
    .where(eq(bookings.userId, user.id))
    .orderBy(asc(bookings.travelDate))
    .limit(15);

  return {
    bookings: rows.map((b) => ({
      reference: formatRef(b.id),
      status: b.status,
      package: b.title,
      packageId: b.destinationId,
      boardingStation: b.fromCity,
      travelDate: formatDate(b.travelDate),
      total: formatPrice(b.totalPrice),
    })),
  };
}

async function listDestinations({ db }) {
  const rows = await db
    .select({
      id: destinations.id,
      title: destinations.title,
      locations: destinations.locations,
      price: destinations.price,
      discountedPrice: destinations.discountedPrice,
    })
    .from(destinations)
    .orderBy(asc(destinations.id))
    .limit(40);

  return {
    destinations: rows.map((d) => ({
      id: d.id,
      title: d.title,
      locations: d.locations,
      pricePerPerson: formatPrice(unitPrice(d)),
    })),
  };
}

async function proposeChangeTrip(ctx, args) {
  const { db, user } = ctx;
  if (!user) return NOT_SIGNED_IN;

  const loaded = await loadOwnBooking(db, user.id, args.booking);
  if (loaded.error) return loaded;

  const { booking, destination, travelerCount } = loaded;

  if (booking.status !== "confirmed") {
    return { error: "Only confirmed bookings can be changed." };
  }

  const nextFromCity = String(args.newFromCity ?? "").trim() || booking.fromCity || "";
  const wantedDestinationId =
    args.newDestinationId == null ? booking.destinationId : Number(args.newDestinationId);

  const fromChanged = nextFromCity !== (booking.fromCity ?? "");
  const destinationChanged = wantedDestinationId !== booking.destinationId;

  if (!fromChanged && !destinationChanged) {
    return { error: "That would not change anything. Ask the user what they want to change." };
  }

  let nextDestination = destination;
  if (destinationChanged) {
    if (!Number.isSafeInteger(wantedDestinationId)) {
      return { error: "That is not a valid package id. Use list_destinations to find it." };
    }
    const [found] = await db
      .select({
        id: destinations.id,
        title: destinations.title,
        price: destinations.price,
        discountedPrice: destinations.discountedPrice,
      })
      .from(destinations)
      .where(eq(destinations.id, wantedDestinationId));

    if (!found) return { error: "No package with that id exists. Use list_destinations." };
    nextDestination = found;
  }

  const oldTotal = booking.totalPrice;
  const newTotal = unitPrice(nextDestination) * travelerCount;
  const ref = formatRef(booking.id);

  const lines = [];
  if (fromChanged) {
    lines.push({
      label: "Boarding station",
      from: booking.fromCity || "Not set",
      to: nextFromCity,
    });
  }
  if (destinationChanged) {
    lines.push({ label: "Package", from: destination.title, to: nextDestination.title });
    lines.push({ label: "Total", from: formatPrice(oldTotal), to: formatPrice(newTotal) });
  }

  const doneParts = [];
  if (fromChanged) doneParts.push(`now departs from ${nextFromCity}`);
  if (destinationChanged) {
    doneParts.push(`is now the ${nextDestination.title} package (new total ${formatPrice(newTotal)})`);
  }

  registerAction(ctx, {
    id: randomUUID(),
    type: "change_trip",
    bookingId: booking.id,
    params: { fromCity: nextFromCity, destinationId: nextDestination.id },
    title: `Change trip ${ref}`,
    lines,
    confirmLabel: "Confirm change",
    doneText: `Done. Booking ${ref} ${doneParts.join(" and ")}.`,
  });

  return {
    status: "awaiting_user_confirmation",
    note: "A confirmation card is now shown to the user. Do not say the change is done. Tell them to review it and press Confirm.",
    change: lines.map((l) => `${l.label}: ${l.from} -> ${l.to}`),
  };
}

async function proposeCancelBooking(ctx, args) {
  const { db, user } = ctx;
  if (!user) return NOT_SIGNED_IN;

  const loaded = await loadOwnBooking(db, user.id, args.booking);
  if (loaded.error) return loaded;

  const { booking, destination } = loaded;

  if (booking.status !== "confirmed") {
    return { error: `Booking ${formatRef(booking.id)} is already ${booking.status}.` };
  }

  const ref = formatRef(booking.id);

  registerAction(ctx, {
    id: randomUUID(),
    type: "cancel_booking",
    bookingId: booking.id,
    params: {},
    title: `Cancel trip ${ref}`,
    lines: [
      { label: "Package", value: destination.title },
      { label: "Travel date", value: formatDate(booking.travelDate) },
      { label: "Total", value: formatPrice(booking.totalPrice) },
    ],
    confirmLabel: "Yes, cancel trip",
    destructive: true,
    doneText: `Done. Booking ${ref} (${destination.title}) has been cancelled.`,
  });

  return {
    status: "awaiting_user_confirmation",
    note: "A confirmation card is now shown to the user. Do not say it is cancelled. Tell them to review it and press the confirm button.",
  };
}

export async function runTool(name, args, ctx) {
  try {
    switch (name) {
      case "list_my_bookings":
        return await listMyBookings(ctx);
      case "list_destinations":
        return await listDestinations(ctx);
      case "propose_change_trip":
        return await proposeChangeTrip(ctx, args ?? {});
      case "propose_cancel_booking":
        return await proposeCancelBooking(ctx, args ?? {});
      default:
        return { error: `Unknown tool: ${name}` };
    }
  } catch (err) {
    console.error(`Tool ${name} failed:`, err);
    return { error: "Something went wrong while doing that. Ask the user to try again." };
  }
}