import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import { FaPlane, FaHotel, FaUmbrellaBeach, FaHeadset } from "react-icons/fa";
import Islands from "../assets/Islands.mp4";

const DESTINATIONS = [
  "Mumbai",
  "Delhi",
  "Ayodhya",
  "Bangalore",
  "Pune",
  "Ahmedabad",
  "Agra",
  "Hyderabad",
  "Kutch",
  "Varanasi",
  "Udaipur",
  "Rishikesh",
  "Leh–Ladakh",
  "Shimla & Kufri",
  "Darjeeling",
  "Andaman & Nicobar Islands",
  "Kaziranga National Park",
  "Mysuru",
  "Sikkim",
];

function Hero() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = query
    ? DESTINATIONS.filter((d) =>
        d.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (value) => {
    setQuery(value);
    navigate("/destination");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/destination");
  };

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "grey.900",
      }}
    >
      {/* Background Video */}
      <Box
        component="video"
        autoPlay
        loop
        muted
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.7,
        }}
      >
        <source src={Islands} type="video/mp4" />
      </Box>

      {/* Content */}
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box textAlign="center" width="100%">
          <Typography
            variant="h3"
            md={{ fontSize: "3.5rem" }}
            fontWeight={700}
            color="white"
            gutterBottom
          >
            Welcome to Wonders of India
          </Typography>

          <Typography
            variant="h6"
            color="white"
            mb={4}
            sx={{ opacity: 0.9 }}
          >
            Explore India with us. Find your perfect destination.
          </Typography>

          {/* Search Bar */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ maxWidth: 500, mx: "auto", position: "relative" }}
          >
            <Box display="flex">
              <TextField
                fullWidth
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search destinations..."
                variant="outlined"
                sx={{
                  bgcolor: "rgba(255,255,255,0.85)",
                  borderRadius: "12px 0 0 12px",
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  borderRadius: "0 12px 12px 0",
                  px: 3,
                }}
              >
                Search
              </Button>
            </Box>

            {/* Dropdown */}
            {filtered.length > 0 && (
              <Paper
                elevation={6}
                sx={{
                  position: "absolute",
                  width: "100%",
                  mt: 1,
                  borderRadius: 2,
                  maxHeight: 220,
                  overflowY: "auto",
                  zIndex: 10,
                }}
              >
                <List>
                  {filtered.map((item) => (
                    <ListItem key={item} disablePadding>
                      <ListItemButton onClick={() => handleSelect(item)}>
                        {item}
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>

          {/* Services */}
          {/* <Grid
            container
            spacing={3}
            mt={8}
            justifyContent="center"
          >
            {services.map((service) => (
              <Grid item xs={12} sm={6} md={3} key={service.title}>
                <Paper
                  elevation={8}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    backdropFilter: "blur(10px)",
                    background:
                      "rgba(255,255,255,0.35)",
                    borderRadius: 4,
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-6px)",
                    },
                  }}
                >
                  <Box mb={1}>{service.icon}</Box>
                  <Typography fontWeight={600}>
                    {service.title}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid> */}
        </Box>
      </Container>
    </Box>
  );
}

export default Hero;

/* Services Data */
// const services = [
//   {
//     title: "Flight Booking",
//     icon: <FaPlane size={42} color="#1976d2" />,
//   },
//   {
//     title: "Hotel Reservations",
//     icon: <FaHotel size={42} color="#2e7d32" />,
//   },
//   {
//     title: "Tour Packages",
//     icon: <FaUmbrellaBeach size={42} color="#ed6c02" />,
//   },
//   {
//     title: "24/7 Travel Support",
//     icon: <FaHeadset size={42} color="#9c27b0" />,
//   },
// ];
