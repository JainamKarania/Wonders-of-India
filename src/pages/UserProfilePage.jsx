import React from "react";
import Navbar from "../Components/Navbar";
import SideBar from "../Components/userprofie/SideBar";
import BookingDetails from "../Components/userprofie/BookingDetails";
import UserProfileCTA from "../Components/userprofie/UserProfileCTA";
import Footer from "../Components/Footer";
const UserProfilePage = () => {
  return (
    <> 
      <Navbar />
      <div className="py-12 bg-gradient-to-b from-orange-50 to-white pt-28 px-4">
       <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        <SideBar />
        <BookingDetails />
        </section>
      </div>
      <UserProfileCTA/>
      <Footer/>
    </>
  );
};

export default UserProfilePage;
