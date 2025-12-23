import {
  Dialog,
  DialogContent,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CakeIcon from "@mui/icons-material/Cake";
import WcIcon from "@mui/icons-material/Wc";
import { useState } from "react";

const AddPersonModal = ({ open, onClose, onAdd }) => {
  const [person, setPerson] = useState({
    name: "",
    email: "",
    age: "",
    type: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPerson({
      ...person,
      [name]: value,
      ...(name === "age" && { type: value < 12 ? "Child" : "Adult" }),
    });
  };

  const handleSubmit = () => {
    onAdd(person);
    setPerson({ name: "", email: "", age: "", type: "", gender: "" });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogContent className="relative rounded-3xl bg-white p-6">
        {/* Close */}
        <IconButton
          onClick={onClose}
          className="!absolute right-3 top-3"
        >
          <CloseIcon />
        </IconButton>

        {/* Header */}
        <header className="mb-4 text-center">
          <h3 className="text-xl font-semibold text-orange-700">
            Add Traveller
          </h3>
          <p className="text-sm text-gray-500">
            Enter traveller details
          </p>
        </header>

        {/* Form */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Name */}
          <TextField
            label="Full Name"
            name="name"
            fullWidth
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon className="text-orange-600" />
                </InputAdornment>
              ),
            }}
          />

          {/* Email */}
          <TextField
            label="Email"
            name="email"
            fullWidth
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon className="text-orange-600" />
                </InputAdornment>
              ),
            }}
          />

          {/* Age */}
          <TextField
            label="Age"
            name="age"
            type="number"
            fullWidth
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CakeIcon className="text-orange-600" />
                </InputAdornment>
              ),
            }}
          />

          {/* Gender */}
          <TextField
            select
            label="Gender"
            name="gender"
            fullWidth
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WcIcon className="text-orange-600" />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </section>

        {/* Derived Type */}
        {person.type && (
          <p className="mt-3 text-sm text-gray-600 text-center">
            Classified as{" "}
            <span className="font-semibold text-orange-700">
              {person.type}
            </span>
          </p>
        )}

        {/* Footer */}
        <footer className="mt-5">
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={!person.name || !person.age}
            className="!rounded-xl !bg-orange-600 hover:!bg-orange-700"
          >
            Add Traveller
          </Button>
        </footer>
      </DialogContent>
    </Dialog>
  );
};

export default AddPersonModal;
