import React from 'react'
import Navbar from "../Components/Navbar";
import SideBar from "../Components/userprofie/SideBar";
import TransactionsDetails from '../Components/transactions/TransactionDetails';

const TransactionHistoryPage = () => {
  return (
    <div>
        <Navbar />
      <div className="py-12 bg-gradient-to-b from-orange-50 to-white pt-28 px-4">
       <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        <SideBar />
        <TransactionsDetails/>
        </section>
      </div>
    </div>
  )
}

export default TransactionHistoryPage