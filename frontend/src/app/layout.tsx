import type { Metadata } from "next";
import "../index.css";

export const metadata: Metadata = {
  title: "Skyward Portal - Airline Management",
  description: "Hệ thống Quản lý Đại lý Bán vé Máy bay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
