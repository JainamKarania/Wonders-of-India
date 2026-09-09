import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
  const [submitting, setSubmitting] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setErrors({});
    setConfirmationMessage(null);

    if (isSignup) {
      const result = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setSubmitting(false);

      if (!result.success) {
        setErrors({ api: result.error });
        return;
      }

      if (result.needsEmailConfirmation) {
        setConfirmationMessage(
          "Account created! Check your email to confirm before signing in."
        );
        setIsSignup(false);
        return;
      }

      navigate("/");
    } else {
      const result = await login(formData.email, formData.password);
      setSubmitting(false);

      if (!result.success) {
        setErrors({ api: result.error || "Invalid email or password" });
        return;
      }

      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-green-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          <FlightTakeoff className="text-orange-500" fontSize="large" />
          <h1 className="text-2xl font-bold text-gray-800">Wonders of India</h1>
        </div>

        <p className="text-center text-gray-500 mb-6">
          {isSignup ? "Create your travel account" : "Welcome back, explorer!"}
        </p>

        {confirmationMessage && (
          <p className="text-center text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
            {confirmationMessage}
          </p>
        )}

        {errors.api && (
          <p className="text-center text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            {errors.api}
          </p>
        )}

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
            disabled={submitting}
            className="!bg-orange-500 hover:!bg-orange-600 !py-3 !rounded-xl"
          >
            {submitting
              ? "Please wait..."
              : isSignup
              ? "Create Account"
              : "Sign In"}
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
              setConfirmationMessage(null);
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