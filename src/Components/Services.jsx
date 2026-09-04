import React, { useEffect, useRef, useState } from "react";
import { Box, Container, Typography, Grid, Paper, Skeleton } from "@mui/material";
import { FaPlane, FaHotel, FaUmbrellaBeach, FaHeadset } from "react-icons/fa";
import axios from "axios";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ICON_MAP = {
  flight: FaPlane,
  hotel: FaHotel,
  package: FaUmbrellaBeach,
  support: FaHeadset,
};

function Services() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/services`
        );
        setServices(res.data.data ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load services.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (loading || error || services.length === 0) return undefined;

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
  }, [loading, error, services]);

  return (
    <Box
      component="section"
      ref={sectionRef}
      sx={{ py: { xs: 8, sm: 10, md: 12 }, bgcolor: "#020617" }}
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

        {loading && (
          <Grid container spacing={{ xs: 3, sm: 4 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton
                  variant="rounded"
                  height={220}
                  sx={{ bgcolor: "rgba(255,255,255,0.06)", borderRadius: 4 }}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && error && (
          <Typography textAlign="center" sx={{ color: "rgba(255,255,255,0.6)" }}>
            {error}
          </Typography>
        )}

        {!loading && !error && services.length > 0 && (
          <Grid container spacing={{ xs: 3, sm: 4 }}>
            {services.map(({ title, desc, icon }, index) => {
              const Icon = ICON_MAP[icon] ?? FaPlane;
              return (
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
                      transition:
                        "transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
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
                        background:
                          "linear-gradient(135deg, #fb923c 0%, #facc15 100%)",
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
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default Services;