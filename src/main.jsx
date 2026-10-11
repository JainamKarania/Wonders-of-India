import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./Components/context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "14px",
            background: "#1a1917",
            color: "#fff",
            fontSize: "14px",
            padding: "12px 16px",
          },
          success: { iconTheme: { primary: "#ea580c", secondary: "#fff" } },
        }}
      />
    </AuthProvider>
  </StrictMode>
);