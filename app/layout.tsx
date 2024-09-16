import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./Providers";
import Appbar from "./components/Appbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sentilizer",
  description: "Youtube comment analyzer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <div className=" absolute top-0 w-full">
            <Appbar />
          </div>
          {children}
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
