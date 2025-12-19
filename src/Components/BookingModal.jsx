import React, { useState } from "react";
import {MdCall, MdCallReceived, MdCallToAction, MdClose, MdContactPhone, MdContacts, MdContactSupport, MdLocalOffer, MdOutlineWifiCalling, MdSupportAgent, MdVerified, MdVerifiedUser} from "react-icons/md"
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const packages = [
  { name: "Rajasthan Heritage Tour", price: 25000, discount: 20 },
  { name: "Kerala Backwaters", price: 22000, discount: 15 },
  { name: "Kashmir Paradise", price: 30000, discount: 25 },
];

const BookingModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    package: "",
  });

  const [errors, setErrors] = useState({});
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Required";
    if (!formData.email) newErrors.email = "Required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.phone) newErrors.phone = "Required";
    if (formData.phone.length < 10) newErrors.phone = "Invalid number";
    if (!formData.package) newErrors.package = "Select a package";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePackageChange = (value) => {
    setFormData({ ...formData, package: value });
    setSelectedPackage(packages.find((p) => p.name === value));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSuccess(true);
  };

  const discountedPrice =
    selectedPackage &&
    selectedPackage.price -
      (selectedPackage.price * selectedPackage.discount) / 100;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent className="relative p-0">
        <h2 className="text-3xl text-orange-400 font-semibold text-center mb-6">
                Book your Package
        </h2>
        {!success ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT PANEL */}
            <div className="bg-slate-900 text-white p-6 flex flex-col gap-8 justify-center">
              <img
              src="https://images.unsplash.com/photo-1599661046827-dacff0c0f09a"
              alt="Package"
              className="rounded-xl object-cover"
            />

              <ul className="flex justify-between text-sm bg-white text-black p-2 rounded-lg">
            
                <li className="flex flex-col text-center items-center gap-3">
                  <MdVerified className="text-blue-400 text-2xl" />
                     10,000+ Travellers
                </li>
                <div className="border-r  border-r-slate-300"></div>
                <li className="flex flex-col text-center items-center gap-3">
                  <MdLocalOffer className="text-orange-400 text-2xl" />
                  Best Offers
                </li>
                <div className="border-r  border-r-slate-300"></div>
                <li className="flex flex-col text-center items-center gap-3">
                  <MdCall className="text-green-400 text-2xl" />
                  Contact Assitance
                </li>
              </ul>
             </div>
              {/* <Typography className="mt-12 text-xs text-center text-slate-300">
                Wonders of India – Your trusted travel partner
              </Typography> */}

            {/* RIGHT PANEL (FORM) */}
            <div className="">

              <div className="space-y-4">
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  error={!!errors.name}
                  helperText={errors.name}
                />

                <TextField
                  fullWidth
                  label="Email ID"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  error={!!errors.email}
                  helperText={errors.email}
                />

                <TextField
                  fullWidth
                  label="Mobile Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  error={!!errors.phone}
                  helperText={errors.phone}
                />

                <TextField
                  select
                  fullWidth
                  label="Select Travel Package"
                  value={formData.package}
                  onChange={(e) => handlePackageChange(e.target.value)}
                  error={!!errors.package}
                  helperText={errors.package}
                >
                  {packages.map((pkg, index) => (
                    <MenuItem key={index} value={pkg.name}>
                      {pkg.name}
                    </MenuItem>
                  ))}
                </TextField>

                {selectedPackage && (
                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg text-sm">
                    <p className="line-through text-gray-500">
                      ₹{selectedPackage.price}
                    </p>
                    <p className="text-green-600">
                      {selectedPackage.discount}% Discount Applied
                    </p>
                    <p className="text-lg font-bold text-orange-600">
                      ₹{discountedPrice}
                    </p>
                  </div>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSubmit}
                  className="!bg-orange-500 hover:!bg-orange-600 !py-3 !font-semibold"
                >
                  Book Now
                </Button>

                <Typography className="text-xs text-gray-500 text-center">
                  By proceeding, you agree to our Terms & Privacy Policy
                </Typography>
              </div>
              <div className="mt-8 flex justify-end">
                <MdClose
                  variant="contained"
                  onClick={onClose}
                  className="!bg-orange-500 hover:!bg-orange-600 text-lg text-white rounded-xl absolute top-1 right-1"
                ></MdClose>
              </div>
            </div>
          </div>
        ) : (
          // SUCCESS SCREEN
          <div className="text-center py-16">
            <CheckCircleIcon className="text-green-500 text-6xl mb-4" />
            <Typography className="text-2xl font-bold mb-2">
              Booking Successful!
            </Typography>
            <Typography className="text-gray-600 mb-6">
              Thank you for choosing{" "}
              <span className="font-semibold text-orange-500">
                Wonders of India
              </span>
              . Our team will contact you shortly.
            </Typography>

            <Button
              variant="contained"
              onClick={onClose}
              className="!bg-orange-500 hover:!bg-orange-600"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
