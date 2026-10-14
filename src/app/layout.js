import "./globals.css";
import { Host_Grotesk } from "next/font/google";
import Providers from "@/providers";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-host-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Fable — Discover & Read Original Ebooks",
  description: "Next-generation digital ebook sharing and publishing platform. Discover, purchase, and read original ebooks.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${hostGrotesk.variable} font-sans antialiased flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200`}>
        {/* Skydda Vertical Margin Guide Lines */}
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          <div className="mx-auto h-full max-w-7xl">
            <div className="relative h-full">
              <div className="absolute left-0 top-0 h-full w-px bg-zinc-700/30" />
              <div className="absolute right-0 top-0 h-full w-px bg-zinc-700/30" />
            </div>
          </div>
        </div>

        <Providers>
          <ErrorBoundary>
            <Navbar />
            <main className="flex-1 relative z-10">{children}</main>
            <Footer />
            <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
