import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import API from "../../api/axios.js";
import { TextField, Button, Divider, IconButton } from "@mui/material";
import {
  Email,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
  FlightTakeoff,
} from "@mui/icons-material";

const Auth = () => {
  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // 🔹 Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Validation logic
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (isSignup && !formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (isSignup) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isSignup) {
      signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate("/");
    } else {
      const success = login(formData.email, formData.password);
      if (!success) {
        setErrors({ api: "Invalid email or password" });
        return;
      }
      navigate("/");
    }
  };

  // const success = login(formData.email, formData.password);

  // if (!success) {
  //   setErrors({ api: "Invalid email or password" });
  //   return;
  // }

  // navigate("/");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-green-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <FlightTakeoff className="text-orange-500" fontSize="large" />
          <h1 className="text-2xl font-bold text-gray-800">Wonders of India</h1>
        </div>

        <p className="text-center text-gray-500 mb-6">
          {isSignup ? "Create your travel account" : "Welcome back, explorer!"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              InputProps={{
                startAdornment: <Person className="mr-2 text-gray-400" />,
              }}
            />
          )}

          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              startAdornment: <Email className="mr-2 text-gray-400" />,
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              startAdornment: <Lock className="mr-2 text-gray-400" />,
              endAdornment: (
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />

          {isSignup && (
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
          )}

          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            className="!bg-orange-500 hover:!bg-orange-600 !py-3 !rounded-xl"
          >
            {isSignup ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <Divider className="!my-6">OR</Divider>

        <p className="text-center text-gray-600">
          {isSignup ? "Already have an account?" : "New to Wonders of India?"}
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setErrors({});
            }}
            className="text-orange-500 font-semibold ml-2 hover:underline"
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
