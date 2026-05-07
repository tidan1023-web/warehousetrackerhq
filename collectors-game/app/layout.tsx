import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Collector's Game — Art, Basketball, and the Private Life of a Public Man",
  description:
    "A travelling exhibition by FOTWRLD × Basketball for Peace. The private collection of Coach Oliver Berdeen Johnson, across four cities in Nigeria.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        {/* Netlify Forms detection — hidden, never shown */}
        <div hidden aria-hidden="true">
          <form name="register-attend" data-netlify="true">
            <input name="name" /><input name="email" /><input name="location" /><input name="message" />
          </form>
          <form name="partner-interest" data-netlify="true">
            <input name="name" /><input name="organisation" /><input name="email" />
            <input name="location" /><input name="partner-type" /><input name="message" />
          </form>
        </div>
      </body>
    </html>
  );
}
