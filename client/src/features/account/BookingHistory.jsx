import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowRight,
  CalendarDays,
  Download,
  Loader2,
  Luggage,
  Phone,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import RecommendedDestinations from "../destinations/RecommendedDestinations";

const formatBookingRef = (id) => `WOI-${String(id).padStart(6, "0")}`;
const formatPrice = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const formatLocations = (locations) =>
  Array.isArray(locations) ? locations.join(", ") : locations ?? "";

const STATUS_BADGE = {
  confirmed: "badge-success",
  cancelled: "badge-danger",
};

function HistorySkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      {[0, 1].map((i) => (
        <div key={i} className="skeleton h-72 w-full !rounded-3xl" />
      ))}
    </div>
  );
}

function InvoiceRow({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="text-sm text-ink-600">{label}</dt>
      <dd
        className={`text-right text-sm ${
          strong ? "text-base font-bold text-ink-900" : "font-medium text-ink-900"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

export default function BookingHistory() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const invoiceRefs = useRef({});

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    if (authLoading) return undefined;

    if (!user) {
      navigate("/auth");
      return undefined;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/bookings`, {
          headers: { Authorization: `Bearer ${session?.access_token}` },
        });

        if (!cancelled) setBookings(res.data.data ?? []);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("We couldn't load your bookings.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, navigate, reloadKey]);

  const downloadInvoice = async (bookingId) => {
    const node = invoiceRefs.current[bookingId];
    if (!node) return;

    setDownloadingId(bookingId);

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(node, { scale: 2, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${formatBookingRef(bookingId)}.pdf`);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't create the invoice. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (authLoading || loading) return <HistorySkeleton />;

  if (error) {
    return (
      <div className="card flex flex-col items-center gap-4 px-6 py-14 text-center">
        <p className="text-ink-700">{error}</p>
        <button
          type="button"
          onClick={() => setReloadKey((k) => k + 1)}
          className="btn-outline"
        >
          <RefreshCw size={16} aria-hidden="true" />
          Try again
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-4 px-6 py-16 text-center">
        <span
          aria-hidden="true"
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700"
        >
          <Luggage size={26} />
        </span>
        <div>
          <p className="text-lg font-bold text-ink-900">No bookings yet</p>
          <p className="mt-1 text-sm text-ink-600">
            Your confirmed trips will show up here.
          </p>
        </div>
        <Link to="/destination" className="btn-primary">
          Browse packages
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <RecommendedDestinations mode="personalized" title="Recommended for you" />

      {bookings.map((booking) => {
        const destination = booking.destination ?? {};
        const perPerson = destination.discountedPrice ?? destination.price ?? 0;
        const status = String(booking.status ?? "").toLowerCase();
        const ref = formatBookingRef(booking.id);
        const isDownloading = downloadingId === booking.id;

        return (
          <article key={booking.id} className="card overflow-hidden">
            <header className="flex flex-col gap-3 border-b border-ink-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
                  Booking ID
                </p>
                <p className="font-display text-lg font-bold text-ink-900">{ref}</p>
              </div>
              <span className={`${STATUS_BADGE[status] ?? "badge"} capitalize`}>
                {booking.status}
              </span>
            </header>

            <div className="space-y-6 p-5 sm:p-6">
              <div className="rounded-2xl bg-brand-50/70 p-4 sm:p-5">
                <p className="font-semibold text-ink-900">{destination.title}</p>
                <div className="mt-3 flex flex-col gap-2 text-sm text-ink-700 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
                  <span className="flex items-center gap-2">
                    <span className="font-medium">{booking.fromCity}</span>
                    <ArrowRight size={14} aria-hidden="true" className="text-ink-400" />
                    <span>{formatLocations(destination.locations)}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <CalendarDays size={16} aria-hidden="true" className="text-ink-500" />
                    {formatDate(booking.travelDate)}
                  </span>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,22rem)]">
                <section aria-label="Travellers">
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-500">
                    Travellers ({booking.travelers.length})
                  </h3>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {booking.travelers.map((traveler) => (
                      <li
                        key={traveler.id}
                        className="rounded-2xl border border-ink-100 p-4"
                      >
                        <p className="font-semibold text-ink-900">{traveler.name}</p>
                        <p className="mt-0.5 text-sm text-ink-600">
                          {traveler.age} yrs · {traveler.gender}
                        </p>
                        {traveler.mobile ? (
                          <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-600">
                            <Phone size={14} aria-hidden="true" />
                            {traveler.mobile}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>

                <section aria-label="Invoice">
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-500">
                    Invoice
                  </h3>

                  <div
                    ref={(el) => {
                      invoiceRefs.current[booking.id] = el;
                    }}
                    style={{ backgroundColor: "#ffffff" }}
                    className="rounded-2xl border border-ink-100 p-5"
                  >
                    <div className="mb-3 flex items-center justify-between border-b border-ink-100 pb-3">
                      <p className="font-bold text-ink-900">Wonders of India</p>
                      <p className="text-xs text-ink-600">{ref}</p>
                    </div>
                    <dl className="divide-y divide-ink-100">
                      <InvoiceRow label="Package" value={destination.title} />
                      <InvoiceRow label="Travel date" value={formatDate(booking.travelDate)} />
                      <InvoiceRow label="Travellers" value={booking.travelers.length} />
                      <InvoiceRow label="Price per person" value={formatPrice(perPerson)} />
                      <InvoiceRow label="Total" value={formatPrice(booking.totalPrice)} strong />
                    </dl>
                    {user?.email ? (
                      <p className="mt-3 text-xs text-ink-600">Billed to {user.email}</p>
                    ) : null}
                  </div>

                  {status !== "cancelled" ? (
                    <button
                      type="button"
                      onClick={() => downloadInvoice(booking.id)}
                      disabled={isDownloading}
                      className="btn-outline mt-3 w-full disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                          Preparing PDF…
                        </>
                      ) : (
                        <>
                          <Download size={16} aria-hidden="true" />
                          Download invoice
                        </>
                      )}
                    </button>
                  ) : null}
                </section>
              </div>
            </div>
          </article>
        );
      })}

      <div className="flex justify-center">
        <Link to="/booking" className="btn-primary">
          Book another trip
        </Link>
      </div>
    </div>
  );
}