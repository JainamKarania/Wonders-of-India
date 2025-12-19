import React, { useEffect, useRef } from "react";
import { Box, Container, Typography, Grid, Paper } from "@mui/material";
import { FaPlane, FaHotel, FaUmbrellaBeach, FaHeadset } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Flight Booking",
    desc: "Best deals on domestic & international flights.",
    icon: <FaPlane size={44} color="#1976d2" />,
  },
  {
    title: "Hotel Reservations",
    desc: "Comfortable stays with top-rated hotels.",
    icon: <FaHotel size={44} color="#2e7d32" />,
  },
  {
    title: "Tour Packages",
    desc: "Customized packages for every destination.",
    icon: <FaUmbrellaBeach size={44} color="#ed6c02" />,
  },
  {
    title: "24/7 Travel Support",
    desc: "Dedicated assistance throughout your journey.",
    icon: <FaHeadset size={44} color="#9c27b0" />,
  },
];

function Services() {
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      cardsRef.current,
      {
        opacity: 0,
        y: 60,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardsRef.current[0],
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <Box component="section" py={{ xs: 8, md: 12 }} className="py-20 bg-slate-950">
      <Container maxWidth="lg">
        {/* Section Heading */}
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h4"
            fontWeight={700}
            gutterBottom
          >
            Our Travel Services
          </Typography>
          <Typography className="text-white" maxWidth={600} mx="auto">
            We offer complete travel solutions to make your journey smooth,
            comfortable, and memorable.
          </Typography>
        </Box>

        {/* Services Grid */}
        <Grid className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={3} key={service.title}>
              <Paper
                ref={(el) => (cardsRef.current[index] = el)}
                elevation={8}
                sx={{
                  p: 4,
                  color: "white",
                  height: "100%",
                  textAlign: "center",
                  borderRadius: 4,
                  backdropFilter: "blur(12px)",
                  background:
                    "rgba(15, 23, 42, 1)",
                  transition: "all 0.35s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Box className="flex justify-center" mb={2}>{service.icon}</Box>

                <Typography variant="h6" fontWeight={600} gutterBottom className="text-white">
                  {service.title}
                </Typography>

                <Typography variant="body2" className="text-white">
                  {service.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Services;
