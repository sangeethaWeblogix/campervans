 "use client";

import { Card, CardContent, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function ThankYouClient() {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: 5,
          maxWidth: 500,
          textAlign: "center",
        }}
      >
        <CardContent>
          <div
            style={{
              width: 80,
              height: 80,
              margin: "0 auto 20px",
              borderRadius: "50%",
              backgroundColor: "#3f3e82",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 13l4 4L19 7"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Thank you for submitting your information with{" "}
            <span style={{ color: "#000" }}>campervanforsale.com.au</span>.
          </Typography>

          <Typography variant="body1" color="text.secondary" gutterBottom>
            Your campervan dealer will contact you as soon as possible.
          </Typography>

          <Link href="/" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: "#3f3e82",
                color: "white",
                "&:hover": { backgroundColor: "#2f2e63" },
              }}
            >
              Go Back
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
