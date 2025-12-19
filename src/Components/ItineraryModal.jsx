import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  Typography,
  MenuItem,
  TextField,
  IconButton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const itineraryPackages = [
  {
    id: "rajasthan",
    title: "Rajasthan Heritage Tour",
    duration: "6 Days / 5 Nights",
    locations: "Jaipur -> Jodhpur -> Udaipur -> Udaipur -> Udaipur",
    coverImage: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a",
    days: [
      {
        day: "Day 1",
        title: "Arrival in Jaipur",
        description: "Arrival and evening city exploration.",
      },
      {
        day: "Day 2",
        title: "Jaipur Sightseeing",
        description: "Amber Fort, City Palace, Hawa Mahal.",
      },
      {
        day: "Day 3",
        title: "Jaipur Sightseeing",
        description: "Amber Fort, City Palace, Hawa Mahal.",
      },
      {
        day: "Day 4",
        title: "Jaipur Sightseeing",
        description: "Amber Fort, City Palace, Hawa Mahal.",
      },
      {
        day: "Day 5",
        title: "Jaipur Sightseeing",
        description: "Amber Fort, City Palace, Hawa Mahal.",
      },
      {
        day: "Day 6",
        title: "Jaipur Sightseeing",
        description: "Amber Fort, City Palace, Hawa Mahal.",
      },
    ],
  },
  {
    id: "mumbai",
    title: "Mumbai City Explorer",
    duration: "4 Days / 3 Nights",
    locations: "Mumbai -> Mumbai",
    coverImage: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f",
    days: [
      {
        day: "Day 1",
        title: "Arrival & Marine Drive",
        description:
          "Arrival, hotel check-in, evening at Marine Drive and Chowpatty.",
      },
      {
        day: "Day 2",
        title: "City Sightseeing",
        description: "Gateway of India, Elephanta Caves, CST, Colaba Causeway.",
      },
      {
        day: "Day 3",
        title: "Bollywood & Local Markets",
        description: "Film City tour, Bandra, street food experience.",
      },
      {
        day: "Day 4",
        title: "Departure",
        description: "Breakfast and departure with memories.",
      },
    ],
  },

  {
    id: "delhi-agra",
    title: "Delhi Agra Heritage Tour",
    duration: "5 Days / 4 Nights",
    locations: "Delhi -> Agra -> Delhi",
    coverImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
    days: [
      {
        day: "Day 1",
        title: "Arrival in Delhi",
        description: "Arrival and local market visit.",
      },
      {
        day: "Day 2",
        title: "Old & New Delhi",
        description: "Red Fort, Jama Masjid, India Gate, Qutub Minar.",
      },
      {
        day: "Day 3",
        title: "Delhi to Agra",
        description: "Drive to Agra, Taj Mahal sunset visit.",
      },
      {
        day: "Day 4",
        title: "Agra Sightseeing",
        description: "Agra Fort, Mehtab Bagh, shopping.",
      },
      {
        day: "Day 5",
        title: "Return to Delhi",
        description: "Breakfast and departure.",
      },
    ],
  },

  {
    id: "ayodhya-varanasi",
    title: "Spiritual Ayodhya & Varanasi",
    duration: "4 Days / 3 Nights",
    locations: "Ayodhya -> Varanasi",
    coverImage: "https://images.unsplash.com/photo-1627894485222-16f6c6c6e1f4",
    days: [
      {
        day: "Day 1",
        title: "Arrival in Ayodhya",
        description: "Ram Janmabhoomi, evening aarti.",
      },
      {
        day: "Day 2",
        title: "Ayodhya Temples",
        description: "Hanuman Garhi, Kanak Bhawan.",
      },
      {
        day: "Day 3",
        title: "Ayodhya to Varanasi",
        description: "Transfer and Ganga Aarti.",
      },
      {
        day: "Day 4",
        title: "Varanasi Sightseeing",
        description: "Boat ride, Kashi Vishwanath Temple.",
      },
    ],
  },

  {
    id: "leh-ladakh",
    title: "Leh–Ladakh Adventure",
    duration: "7 Days / 6 Nights",
    locations: "Leh -> Nubra -> Pangong -> Leh",
    coverImage: "https://images.unsplash.com/photo-1509644853901-13c96b4b0f3c",
    days: [
      {
        day: "Day 1",
        title: "Arrival in Leh",
        description: "Acclimatization and local walk.",
      },
      {
        day: "Day 2",
        title: "Leh Sightseeing",
        description: "Shanti Stupa, Leh Palace.",
      },
      {
        day: "Day 3",
        title: "Leh to Nubra Valley",
        description: "Khardung La pass, sand dunes.",
      },
      {
        day: "Day 4",
        title: "Nubra to Pangong",
        description: "Scenic drive and lake visit.",
      },
      {
        day: "Day 5",
        title: "Pangong to Leh",
        description: "Return journey.",
      },
      {
        day: "Day 6",
        title: "Local Exploration",
        description: "Markets and monasteries.",
      },
      {
        day: "Day 7",
        title: "Departure",
        description: "Checkout and fly back.",
      },
    ],
  },
  {
    id: "kerala",
    title: "Kerala Backwaters Escape",
    duration: "5 Days / 4 Nights",
    locations: "Cochin • Munnar • Alleppey",
    coverImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944",
    days: [
      {
        day: "Day 1",
        title: "Arrival in Cochin",
        description: "Arrival and leisure evening.",
      },
      {
        day: "Day 2",
        title: "Munnar Hills",
        description: "Tea gardens & scenic viewpoints.",
      },
    ],
  },
  {
    id: "kashmir",
    title: "Kashmir Paradise",
    duration: "6 Days / 5 Nights",
    locations: "Srinagar • Gulmarg • Pahalgam",
    coverImage: "https://images.unsplash.com/photo-1618758641791-3a03d3f0a0d6",
    days: [
      {
        day: "Day 1",
        title: "Arrival in Srinagar",
        description: "Houseboat stay & Dal Lake.",
      },
      {
        day: "Day 2",
        title: "Gulmarg Excursion",
        description: "Snow activities & cable car ride.",
      },
    ],
  },
];

// const ItineraryModal = ({ open, onClose }) => {
//   const [selectedId, setSelectedId] = useState("rajasthan");

//   const selectedPackage = itineraryPackages.find(
//     (pkg) => pkg.id === selectedId
//   );

const ItineraryModal = ({ open, onClose }) => {
  const [selectedId, setSelectedId] = useState("rajasthan");

  const selectedPackage = itineraryPackages.find(
    (pkg) => pkg.id === selectedId
  );

  if (!selectedPackage) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      className="backdrop-blur-sm"
    >
      <DialogContent className="p-0 relative overflow-hidden">
        {/* CLOSE BUTTON */}
        <IconButton
          onClick={onClose}
          className="!absolute -top-4 -right-4 z-[100] 
             bg-orange-500 hover:bg-orange-600 
             text-white shadow-xl"
        >
          <MdClose size={22} />
        </IconButton>

        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[80vh]">
          {/* LEFT PANEL */}
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 md:p-8 flex flex-col gap-6">
            <div>
              <Typography className="text-2xl font-bold">
                {selectedPackage.title}
              </Typography>
              <Typography className="text-sm text-slate-300 mt-1">
                {selectedPackage.duration}
              </Typography>
            </div>

            <img
              src={selectedPackage.coverImage}
              alt="Package"
              className="rounded-2xl object-cover h-56 md:h-64 shadow-lg"
            />

            <div className="flex items-start gap-2 text-sm">
              <LocationOnIcon className="text-orange-400 mt-0.5" />
              <span className="leading-relaxed">
                {selectedPackage.locations}
              </span>
            </div>

            <Typography className="mt-auto text-xs text-slate-400">
              ✨ Switch itineraries without closing this modal
            </Typography>
          </div>

          {/* RIGHT PANEL */}
          <div className="p-6 md:p-8 overflow-y-auto bg-white">
            {/* SELECT DROPDOWN */}
            <TextField
              select
              fullWidth
              label="Choose another itinerary"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="mb-6"
            >
              {itineraryPackages.map((pkg) => (
                <MenuItem key={pkg.id} value={pkg.id}>
                  {pkg.title}
                </MenuItem>
              ))}
            </TextField>

            <Typography className="text-xl font-bold mb-6">
              Day-wise Itinerary
            </Typography>

            <div className="space-y-5">
              {selectedPackage.days.map((day, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-start pb-4 border-b last:border-none"
                >
                  <div>
                    <Typography className="font-semibold text-sm">
                      {day.day} — {day.title}
                    </Typography>
                    <Typography className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {day.description}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItineraryModal;
