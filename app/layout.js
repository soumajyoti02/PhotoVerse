import { Inter } from "next/font/google";
import { Merienda } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import { Suspense } from 'react'


const inter = Inter({ subsets: ["latin"] });
const merienda = Merienda({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${merienda.className} bg-[#e7ecef]`}>
        <Suspense>
          {children}
        </Suspense>
        <Footer />
      </body>
    </html>
  );
}
