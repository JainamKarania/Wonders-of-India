import {
  pgTable,
  serial,
  uuid,
  text,
  integer,
  real,
  timestamp,
} from "drizzle-orm/pg-core";

// Extends Supabase's built-in auth.users table with app-specific profile
// fields. Supabase manages auth.users itself (password hashes, sessions);
// this table just holds the extra data your app needs, keyed to the same id.
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  fullName: text("full_name"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  locations: text("locations").notNull(),
  price: integer("price"),
  discountedPrice: integer("discounted_price"),
  image: text("image"),
  tag: text("tag"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  desc: text("desc").notNull(),
  icon: text("icon").notNull(),
});

export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  desc: text("desc").notNull(),
  icon: text("icon").notNull(),
});

export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  value: text("value").notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  review: text("review").notNull(),
  rating: real("rating").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  destinationId: integer("destination_id")
    .notNull()
    .references(() => destinations.id),
  travelDate: timestamp("travel_date").notNull(),
  totalPrice: integer("total_price").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const travelers = pgTable("travelers", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  age: integer("age"),
});