import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import axios from "axios";
import toast from "react-hot-toast";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import { Send, LocationOn, Call, Email } from "@mui/icons-material";

gsap.registerPlugin(ScrollTrigger);

const CONTACT_INFO = [
  {
    icon: LocationOn,
    title: "Our Office",
    desc: "Mumbai, Maharashtra, India",
  },
  {
    icon: Call,
    title: "Call Us",
    desc: "+91 98765 43210",
  },
  {
    icon: Email,
    title: "Email Us",
    desc: "support@wondersofindia.com",
  },
];

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function Contact() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current?.children, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });

      gsap.from(formRef.current, {
        opacity: 0,
        x: -40,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.from(infoRef.current?.children, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/contact`,
        formData
      );

      if (!res.data.success) throw new Error(res.data.message);

      toast.success("Message sent! We'll get back to you soon.");
      setFormData(EMPTY_FORM);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to send message. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className="relative overflow-hidden bg-slate-50"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top_left,white,transparent_70%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <header
          ref={headerRef}
          className="mx-auto max-w-3xl text-center space-y-4"
        >
          <h2
            id="contact-heading"
            className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl"
          >
            Get in Touch With Us
          </h2>
          <p className="text-base text-slate-600 sm:text-lg">
            Have questions or need a custom travel plan? Our experts at Wonders of
            India are happy to help you.
          </p>
        </header>

        <div className="mt-12 sm:mt-16 grid gap-10 sm:gap-12 lg:grid-cols-2">
          <Card
            ref={formRef}
            elevation={0}
            className="rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <CardContent className="p-5 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="grid gap-5 sm:gap-6 sm:grid-cols-2">
                  <TextField
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                </div>

                <div className="grid gap-5 sm:gap-6 sm:grid-cols-2">
                  <TextField
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                  <TextField
                    select
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    fullWidth
                  >
                    <MenuItem value="General Inquiry">General Inquiry</MenuItem>
                    <MenuItem value="Custom Trip">Custom Trip</MenuItem>
                    <MenuItem value="Booking Support">Booking Support</MenuItem>
                    <MenuItem value="Partnership">Partnership</MenuItem>
                  </TextField>
                </div>

                <TextField
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                  fullWidth
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={submitting}
                  startIcon={<Send />}
                  className="!rounded-2xl !bg-slate-900 !px-6 sm:!px-8 !py-2.5 sm:!py-3 !text-sm sm:!text-base !font-semibold !normal-case hover:!bg-black"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <aside ref={infoRef} className="space-y-5 sm:space-y-6">
            {CONTACT_INFO.map(({ icon: Icon, title, desc }) => (
              <article
                key={title}
                className="flex items-start gap-4 rounded-2xl bg-white p-5 sm:p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100">
                  <Icon className="text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{desc}</p>
                </div>
              </article>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}