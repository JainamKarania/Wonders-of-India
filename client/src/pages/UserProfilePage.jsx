import Navbar from "../layout/Navbar";
import SideBar from "../features/account/SideBar";
import BookingDetails from "../features/account/BookingDetails";
import UserProfileCTA from "../features/account/UserProfileCTA";
import Footer from "../layout/Footer";

const UserProfilePage = () => (
  <div className="min-h-screen bg-ink-50">
    <Navbar />

    <main className="container-page pt-24 pb-12 sm:pt-28 sm:pb-16">
      <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start lg:gap-8">
        <SideBar />

        <div className="min-w-0 space-y-8">
          <header>
            <h1 className="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">
              My bookings
            </h1>
            <p className="mt-1 text-sm text-ink-600">
              Manage your upcoming trips, change a boarding station or package, or cancel.
            </p>
          </header>

          <BookingDetails />
          
        </div>
      </div>
    </main>

    <UserProfileCTA />

    <Footer showCta={false} />
  </div>
);

export default UserProfilePage;