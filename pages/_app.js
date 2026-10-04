import "../styles/globals.css";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import { useEffect } from "react";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export default function App({ Component, pageProps }) {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className={`${bebas.variable} ${dmSans.variable} font-sans`}>
      <Component {...pageProps} />
    </div>
  );
}
