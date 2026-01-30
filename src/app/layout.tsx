import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers";

export const metadata: Metadata = {
  title: "Flow Board",
  description: "Productivity Web App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <head />
        <body>
          <Providers>{children}</Providers>
        </body>
      </html>
    </>
  );
}
