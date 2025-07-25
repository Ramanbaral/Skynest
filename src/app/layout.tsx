import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import "dotenv/config";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { FilesAndFoldersStoreProvider } from "@/providers/filesAndFoldersStoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SKYNEST",
  description:
    "Skynest is a cloud-based platform that allows users to seamlessly upload, organize, and manage their digital content. Designed with simplicity and efficiency in mind, Skynest supports secure storage of images and PDFs, giving users the ability to create folders, upload files, and keep their documents neatly organized in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          <Toaster richColors />
          <ClerkProvider>
            <FilesAndFoldersStoreProvider>{children}</FilesAndFoldersStoreProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
