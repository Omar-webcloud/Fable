"use client";

import ToastProvider from "./ToastProvider";
import { AuthProvider } from "./AuthProvider";
import { WishlistProvider } from "./WishlistProvider";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <WishlistProvider>
          <ToastProvider>{children}</ToastProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
