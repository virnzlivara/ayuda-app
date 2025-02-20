// app/layout.tsx
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Custom App",
  description: "A customizable home screen icon in Next.js 15",
  icons: {
    icon: "/favicon.ico",  
    apple: "/apple-icon.png", 
    other: [
      {
        rel: "manifest",
        url: "/manifest.json",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
