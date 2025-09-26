export const metadata = {
  title: "Wandr — World Wonders Travel",
  description: "Tours, visa assistance, and easy reservations.",
};

import "./globals.css";

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body>{children}</body>
    </html>
  );
}
