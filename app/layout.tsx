import type { Metadata } from "next";

import '../styles/base.css';
import '../styles/vendor.css';
import '../styles/font-awesome/css/font-awesome.min.css';
import '../styles/micons/micons.css';
import '../styles/font.css';
import '../styles/main.css';
import "./globals.scss";

export const metadata: Metadata = {
  title: {
    default: "Abstract",
    template: "%s | Abstract",
  },
  description: "A modern blog about design, development, and creativity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body id="top">{children}</body>
    </html>
  );
}
