import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Plane,
  User,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "./AuthContext.jsx";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INITIAL_FORM = { name: "", email: "", password: "", confirmPassword: "" };

function Field({ id, label, error, icon: Icon, endAdornment, ...inputProps }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="relative">
        {Icon ? (
          <Icon
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
          />
        ) : null}
        <input
          id={id}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`input ${Icon ? "pl-10" : ""} ${endAdornment ? "pr-11" : ""} ${
            error ? "!border-red-400 focus:!ring-red-200" : ""
          }`}
          {...inputProps}
        />
        {endAdornment}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function Auth() {
  const { user, signup, login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  if (user) return <Navigate to={redirectTo} replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] || prev.api ? { ...prev, [name]: undefined, api: undefined } : prev));
  };

  const validateForm = () => {
    const next = {};

    if (isSignup && !formData.name.trim()) next.name = "Full name is required";

    if (!formData.email) next.email = "Email is required";
    else if (!EMAIL_REGEX.test(formData.email)) next.email = "Enter a valid email address";

    if (!formData.password) next.password = "Password is required";
    else if (formData.password.length < 6) next.password = "Use at least 6 characters";

    if (isSignup) {
      if (!formData.confirmPassword) next.confirmPassword = "Confirm your password";
      else if (formData.password !== formData.confirmPassword) {
        next.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const toggleMode = () => {
    setIsSignup((prev) => !prev);
    setErrors({});
    setConfirmationMessage(null);
    setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrors({});

    const result = await loginWithGoogle();

    if (!result.success) {
      setErrors({ api: result.error });
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setErrors({});
    setConfirmationMessage(null);

    if (isSignup) {
      const result = await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      setSubmitting(false);

      if (!result.success) {
        setErrors({ api: result.error });
        return;
      }

      if (result.needsEmailConfirmation) {
        setConfirmationMessage(
          "Account created! Check your email to confirm it before signing in."
        );
        setIsSignup(false);
        setFormData((prev) => ({ ...INITIAL_FORM, email: prev.email }));
        return;
      }

      navigate(redirectTo, { replace: true });
      return;
    }

    const result = await login(formData.email.trim(), formData.password);
    setSubmitting(false);

    if (!result.success) {
      setErrors({ api: result.error || "Invalid email or password" });
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  const busy = submitting || googleLoading;

  return (
    <div className="grid min-h-screen bg-ink-50 lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-ink-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl"
        />

        <Link to="/" className="relative inline-flex items-center gap-2 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600">
            <Plane size={20} aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-extrabold">Wonders of India</span>
        </Link>

        <div className="relative">
          <h2 className="font-display text-4xl font-extrabold leading-tight text-white text-balance">
            Your next journey across India starts here.
          </h2>
          <p className="mt-4 max-w-md text-ink-300">
            Sign in to book packages, manage your trips and keep every booking in one place.
          </p>
        </div>

        <p className="relative text-sm text-ink-400">
          Handcrafted itineraries · Local guides · Clear pricing
        </p>
      </aside>

      <main className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-900"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to home
          </Link>

          <h1 className="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-ink-600">
            {isSignup
              ? "It only takes a minute to get started."
              : "Sign in to continue planning your trip."}
          </p>

          <div aria-live="polite" className="mt-6 space-y-3 empty:hidden">
            {confirmationMessage ? (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                {confirmationMessage}
              </p>
            ) : null}
            {errors.api ? (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {errors.api}
              </p>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            {isSignup ? (
              <Field
                id="name"
                name="name"
                label="Full name"
                icon={User}
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />
            ) : null}

            <Field
              id="email"
              name="email"
              type="email"
              label="Email address"
              icon={Mail}
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <Field
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              icon={Lock}
              autoComplete={isSignup ? "new-password" : "current-password"}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-900"
                >
                  {showPassword ? (
                    <EyeOff size={18} aria-hidden="true" />
                  ) : (
                    <Eye size={18} aria-hidden="true" />
                  )}
                </button>
              }
            />

            {isSignup ? (
              <Field
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                label="Confirm password"
                icon={Lock}
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                  Please wait…
                </>
              ) : isSignup ? (
                "Create account"
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-ink-400">
            <span className="h-px flex-1 bg-ink-200" />
            or
            <span className="h-px flex-1 bg-ink-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={busy}
            className="btn-outline w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {googleLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                Redirecting…
              </>
            ) : (
              <>
                <FcGoogle size={20} aria-hidden="true" />
                Continue with Google
              </>
            )}
          </button>

          <p className="mt-8 text-center text-sm text-ink-600">
            {isSignup ? "Already have an account?" : "New to Wonders of India?"}
            <button
              type="button"
              onClick={toggleMode}
              className="ml-1.5 font-semibold text-brand-700 hover:underline"
            >
              {isSignup ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}