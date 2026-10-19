import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, Mail, MapPin, Phone, Send } from "lucide-react";

const CONTACT = {
  address: "Bengaluru, Karnataka, India",
  phoneDisplay: "+91 98765 43210",
  phoneHref: "+919876543210",
  email: "hello@wondersofindia.travel",
};

const CONTACT_INFO = [
  { icon: MapPin, title: "Our office", value: CONTACT.address },
  {
    icon: Phone,
    title: "Call us",
    value: CONTACT.phoneDisplay,
    href: `tel:${CONTACT.phoneHref}`,
  },
  {
    icon: Mail,
    title: "Email us",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
  },
];

const SUBJECTS = ["General Inquiry", "Custom Trip", "Booking Support", "Partnership"];
const EMPTY_FORM = { name: "", email: "", phone: "", subject: "", message: "" };
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Enter your name";
  if (!form.email.trim()) errors.email = "Enter your email";
  else if (!EMAIL_REGEX.test(form.email)) errors.email = "Enter a valid email address";
  if (!form.phone.trim()) errors.phone = "Enter your phone number";
  else if (form.phone.replace(/\D/g, "").length < 10) errors.phone = "Enter a valid phone number";
  if (!form.subject) errors.subject = "Choose a subject";
  if (!form.message.trim()) errors.message = "Write a short message";
  return errors;
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const found = validate(formData);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      });

      if (!res.data.success) throw new Error(res.data.message);

      toast.success("Message sent! We'll get back to you soon.");
      setFormData(EMPTY_FORM);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to send your message. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputProps = (name) => ({
    id: name,
    name,
    value: formData[name],
    onChange: handleChange,
    "aria-invalid": errors[name] ? "true" : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    className: `input ${errors[name] ? "!border-red-400 focus:!ring-red-200" : ""}`,
  });

  return (
    <section aria-labelledby="contact-heading" className="section bg-ink-50">
      <div className="container-page">
        <header className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Contact</p>
          <h2 id="contact-heading" className="section-title mt-3 text-balance">
            Get in touch with us
          </h2>
          <p className="section-subtitle mx-auto">
            Have a question or want a custom travel plan? Send us a message and
            we'll get back to you.
          </p>
        </header>

        <div className="mt-10 grid gap-8 sm:mt-14 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-10">
          <form onSubmit={handleSubmit} noValidate className="card space-y-5 p-5 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="name" label="Full name" error={errors.name}>
                <input {...inputProps("name")} autoComplete="name" />
              </Field>
              <Field id="email" label="Email address" error={errors.email}>
                <input {...inputProps("email")} type="email" autoComplete="email" />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="phone" label="Phone number" error={errors.phone}>
                <input {...inputProps("phone")} type="tel" autoComplete="tel" />
              </Field>
              <Field id="subject" label="Subject" error={errors.subject}>
                <select {...inputProps("subject")}>
                  <option value="">Select a subject</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field id="message" label="Message" error={errors.message}>
              <textarea {...inputProps("message")} rows={5} className={`${inputProps("message").className} resize-y`} />
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                <>
                  <Send size={18} aria-hidden="true" />
                  Send message
                </>
              )}
            </button>
          </form>

          <aside className="space-y-4">
            {CONTACT_INFO.map(({ icon: Icon, title, value, href }) => (
              <div key={title} className="card flex items-start gap-4 p-5">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700"
                >
                  <Icon size={22} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-ink-900">{title}</h3>
                  {href ? (
                    <a
                      href={href}
                      className="mt-1 block break-words text-sm text-ink-600 hover:text-brand-700 hover:underline"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm text-ink-600">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}