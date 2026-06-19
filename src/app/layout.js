import "./globals.css";
import Providers from "@/providers";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";

export const metadata = {
  title: "Fable - Ebook Sharing Platform",
  description: "Discover, purchase, and read original ebooks",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <ErrorBoundary>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
