import "./../globals.css";
import { Inter, Poppins } from "next/font/google";
import CookiesModal from "@/components/CookiesModal";

import DashNav from "@/components/dashboard/DashNav";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Dashboard - TinyClicks",
  description: "Manage your links with ease.",
  keywords:
    "URL shortener,Link management,Short link,Custom URL,Digital marketing tool,TinyClicks,Link tracking,Free URL shortener,Shareable links,Online marketing",
};

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <script
        async
        src="https://kit.fontawesome.com/a7908c27f8.js"
        crossorigin="anonymous"
        strategy="lazyOnload"
      ></script>

      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
        crossorigin="anonymous"
        strategy="beforeInteractive"
      ></script>

      <body className={poppins.className}>
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:hidden flex justify-center py-4 border-b bg-white">
            <Image
              src="/images/Indira_Gandhi_International_Airport_Dashboard.png"
              alt="Indira Gandhi International Airport"
              width={200}
              height={60}
              className="object-contain"
            />
          </div>
          <div className="flex w-full">
            <DashNav />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
