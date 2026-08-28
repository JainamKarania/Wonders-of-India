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
    icon: FaPlane,
  },
  {
    title: "Tour Packages",
    desc: "Customized packages for every destination.",
    icon: FaUmbrellaBeach,
  },
  {
    title: "24/7 Travel Support",
    desc: "Dedicated assistance throughout your journey.",
    icon: FaHeadset,
  },
];

function Services() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current[0],
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box
      component="section"
      ref={sectionRef}
      sx={{
        py: { xs: 8, sm: 10, md: 12 },
        bgcolor: "#020617",
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={{ xs: 5, sm: 7 }}>
          <Typography
            variant="h4"
            fontWeight={800}
            color="white"
            gutterBottom
            sx={{ fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" } }}
          >
            Our Travel Services
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.7)",
              maxWidth: 600,
              mx: "auto",
              fontSize: { xs: "0.95rem", sm: "1rem" },
            }}
          >
            We offer complete travel solutions to make your journey smooth,
            comfortable, and memorable.
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 3, sm: 4 }}>
          {services.map(({ title, desc, icon: Icon }, index) => (
            <Grid item xs={12} sm={6} md={3} key={title}>
              <Paper
                ref={(el) => (cardsRef.current[index] = el)}
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4 },
                  height: "100%",
                  textAlign: "center",
                  borderRadius: 4,
                  bgcolor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  transition: "transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    borderColor: "rgba(251,146,60,0.5)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
                  },
                }}
              >
                <Box
                  aria-hidden="true"
                  sx={{
                    width: { xs: 64, sm: 72 },
                    height: { xs: 64, sm: 72 },
                    borderRadius: "50%",
                    mx: "auto",
                    mb: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #fb923c 0%, #facc15 100%)",
                  }}
                >
                  <Icon size={30} color="#020617" />
                </Box>

                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="white"
                  gutterBottom
                  sx={{ fontSize: { xs: "1.05rem", sm: "1.15rem" } }}
                >
                  {title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.65)" }}
                >
                  {desc}
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