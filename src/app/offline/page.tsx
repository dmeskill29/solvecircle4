"use client";

import { Box, Container, Typography } from "@mui/material";
import WifiOffIcon from "@mui/icons-material/WifiOff";

export default function OfflinePage() {
  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          gap: 2,
        }}
      >
        <WifiOffIcon sx={{ fontSize: 64, color: "primary.main" }} />
        <Typography variant="h4" component="h1" gutterBottom>
          You&apos;re Offline
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please check your internet connection and try again.
        </Typography>
      </Box>
    </Container>
  );
}
