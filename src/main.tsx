import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import App from "./App.tsx";
import { queryClient } from "./lib/queryClient.ts";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#18181f",
            color: "#f1f1f4",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "0.75rem",
            fontSize: "0.875rem",
          },
          success: { iconTheme: { primary: "#10b981", secondary: "#18181f" } },
          error:   { iconTheme: { primary: "#ef4444", secondary: "#18181f" } },
        }}
      />
    </QueryClientProvider>
  </StrictMode>
);
