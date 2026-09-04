import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemButton,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import Islands from "../assets/Islands.mp4";

function Hero() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchDestinationNames = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/destinations`
        );
        const items = res.data.data ?? [];

        // `locations` may hold one place or a comma-separated few — split
        // defensively either way, then dedupe against a fallback to `title`
        // for any package that doesn't set locations at all.
        const names = items.flatMap((item) => {
          if (item.locations) {
            return item.locations.split(",").map((loc) => loc.trim());
          }
          return item.title ? [item.title] : [];
        });

        setDestinations([...new Set(names)].filter(Boolean).sort());
      } catch (err) {
        console.error(err);
        // Search suggestions are a nice-to-have, not critical — fail quietly
        // and just leave the dropdown empty rather than breaking the hero.
        setDestinations([]);
      }
    };

    fetchDestinationNames();
  }, []);

  const filtered = query
    ? destinations.filter((d) => d.toLowerCase().includes(query.toLowerCase()))
    : [];

  const goToDestinations = (searchValue) => {
    const trimmed = searchValue.trim();
    navigate(
      trimmed ? `/destination?search=${encodeURIComponent(trimmed)}` : "/destination"
    );
  };

  const handleSelect = (value) => {
    setQuery(value);
    goToDestinations(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    goToDestinations(query);
  };

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        height: { xs: "100dvh", md: "100vh" },
        minHeight: 560,
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
        playsInline
        preload="auto"
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

      {/* Readability overlay — darkens toward the bottom so text and the
          search bar stay legible regardless of what the video shows */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* Content */}
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box textAlign="center" width="100%">
          <Typography
            variant="h3"
            fontWeight={800}
            color="white"
            gutterBottom
            sx={{
              fontSize: { xs: "2rem", sm: "2.75rem", md: "3.5rem" },
              lineHeight: 1.15,
              textShadow: "0 2px 24px rgba(0,0,0,0.35)",
            }}
          >
            Welcome to{" "}
            <Box component="span" sx={{ color: "#fb923c" }}>
              Wonders of India
            </Box>
          </Typography>

          <Typography
            variant="h6"
            color="white"
            mb={{ xs: 3, sm: 4 }}
            sx={{
              opacity: 0.9,
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            Explore India with us. Find your perfect destination.
          </Typography>

          {/* Search Bar */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            role="search"
            sx={{ maxWidth: 560, mx: "auto", position: "relative" }}
          >
            <Paper
              elevation={0}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "stretch",
                gap: { xs: 1, sm: 0 },
                p: { xs: 1, sm: 0.75 },
                borderRadius: "16px",
                bgcolor: "rgba(255,255,255,0.95)",
                boxShadow:
                  "0 8px 30px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.4)",
                transition: "box-shadow 0.3s",
                "&:focus-within": {
                  boxShadow:
                    "0 8px 30px rgba(0,0,0,0.35), 0 0 0 2px #fb923c",
                },
              }}
            >
              <TextField
                fullWidth
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search destinations..."
                variant="outlined"
                aria-label="Search destinations"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "grey.500" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: "12px",
                    bgcolor: "transparent",
                    "& fieldset": { border: "none" },
                  },
                }}
              />
              <Button
                type="submit"
                size="large"
                sx={{
                  borderRadius: "12px",
                  px: 4,
                  py: { xs: 1.25, sm: 1.5 },
                  fontWeight: 700,
                  letterSpacing: 0.3,
                  color: "black",
                  background: "linear-gradient(90deg, #fb923c 0%, #facc15 100%)",
                  boxShadow: "none",
                  "&:hover": {
                    background: "linear-gradient(90deg, #f97316 0%, #eab308 100%)",
                    boxShadow: "none",
                  },
                }}
              >
                Search
              </Button>
            </Paper>

            {/* Dropdown */}
            {filtered.length > 0 && (
              <Paper
                elevation={6}
                sx={{
                  position: "absolute",
                  width: "100%",
                  mt: 1,
                  borderRadius: 2,
                  maxHeight: { xs: 180, sm: 220 },
                  overflowY: "auto",
                  zIndex: 10,
                  textAlign: "left",
                }}
              >
                <List role="listbox">
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
        </Box>
      </Container>
    </Box>
  );
}

export default Hero;