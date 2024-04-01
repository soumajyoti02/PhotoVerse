import { Inter } from "next/font/google";
import { Merienda } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });
const merienda = Merienda({ subsets: ["latin"] });

export const metadata = {
  title: "PhotoVerse",
  description: "A platform to like, save and download your desired photos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${merienda.className} bg-[#e7ecef]`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
