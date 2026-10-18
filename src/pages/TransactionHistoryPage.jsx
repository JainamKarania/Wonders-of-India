import Navbar from "../Components/Navbar";
import SideBar from "../Components/userprofile/SideBar";
import TransactionsDetails from "../Components/transactions/TransactionDetails";
import Footer from "../Components/Footer";

const TransactionHistoryPage = () => (
  <div className="min-h-screen bg-ink-50">
    <Navbar />

    <main className="container-page pt-24 pb-12 sm:pt-28 sm:pb-16">
      <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start lg:gap-8">
        <SideBar />

        <div className="min-w-0 space-y-8">
          <header>
            <h1 className="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">
              Transactions
            </h1>
            <p className="mt-1 text-sm text-ink-600">
              A record of your bookings and their amounts with Wonders of India.
            </p>
          </header>

          <TransactionsDetails />
        </div>
      </div>
    </main>

    <Footer />
  </div>
);

export default TransactionHistoryPage;