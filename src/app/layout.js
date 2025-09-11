import { Geist_Mono } from "next/font/google";
import { Tajawal } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import { HeroUIProvider } from "@heroui/react";
import ReduxProvider from "../components/ReduxProvider";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "../components/ScrollToTop";

const tajawal = Tajawal({
  weight: ['400', '500', '700'],
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "متجر منتجات المدرسة",
  description: "موقع التجارة الإلكترونية لمنتجات المدرسة",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" data-arp="">
      <body
        className={`${tajawal.variable} ${geistMono.variable} antialiased font-tajawal bg-stone-100`}
      >
        <ReduxProvider>
          <HeroUIProvider>
            <ScrollToTop />
            <Navbar />
            <div className="min-h-[calc(100vh-4rem)] mt-[64px] bg-stone-100">
             
             {children}
           
           </div>
            <Footer />
            <CartDrawer />
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </HeroUIProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
