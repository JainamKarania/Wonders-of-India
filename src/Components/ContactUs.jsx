import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import { Send, LocationOn, Call, Email } from "@mui/icons-material";

/**
 * Contact Component – Wonders of India
 * Focus: Easy communication, clarity, trust
 * Tech: React, Tailwind CSS, Material UI, GSAP
 */

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current.children, {
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

      gsap.from(infoRef.current.children, {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // Integrate API / Email service here
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className="relative overflow-hidden bg-slate-50"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,white,transparent_70%)] opacity-60" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24">
        {/* Header */}
        <header
          ref={headerRef}
          className="mx-auto max-w-3xl text-center space-y-4"
        >
          <h2
            id="contact-heading"
            className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
          >
            Get in Touch With Us
          </h2>
          <p className="text-base text-slate-600 sm:text-lg">
            Have questions or need a custom travel plan? Our experts at Wonders of
            India are happy to help you.
          </p>
        </header>

        {/* Content */}
        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <Card
            ref={formRef}
            elevation={0}
            className="rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
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

                <div className="grid gap-6 sm:grid-cols-2">
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
                  startIcon={<Send />}
                  className="!rounded-2xl !bg-slate-900 !px-8 !py-3 !text-base !font-semibold !normal-case hover:!bg-black"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <aside ref={infoRef} className="space-y-6">
            {[{
              icon: <LocationOn className="text-indigo-600" fontSize="large" />,
              title: "Our Office",
              desc: "Mumbai, Maharashtra, India",
            },{
              icon: <Call className="text-indigo-600" fontSize="large" />,
              title: "Call Us",
              desc: "+91 98765 43210",
            },{
              icon: <Email className="text-indigo-600" fontSize="large" />,
              title: "Email Us",
              desc: "support@wondersofindia.com",
            }].map((item) => (
              <article
                key={item.title}
                className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm"
              >
                <div>{item.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {item.desc}
                  </p>
                </div>
              </article>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}
