"use client";

import ToastProvider from "./ToastProvider";
import { AuthProvider } from "./AuthProvider";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  );
}
