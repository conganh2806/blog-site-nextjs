import type { Metadata } from "next";
import { Suspense } from "react";

import { TopProgressBar } from "@/components/layout/top-progress-bar";

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
      <body id="top">
        <Suspense
          fallback={(
            <div className="pace top-progress pace-active" aria-hidden="true">
              <div className="pace-progress" />
            </div>
          )}
        >
          <TopProgressBar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
