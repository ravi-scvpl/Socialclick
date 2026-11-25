import "./../globals.css";
import DashNav from "@/components/dashboard/DashNav";
import Image from "next/image";

export const metadata = {
  title: "Dashboard - TinyClicks",
  description: "Manage your links with ease.",
  keywords:
    "URL shortener,Link management,Short link,Custom URL,Digital marketing tool,TinyClicks,Link tracking,Free URL shortener,Shareable links,Online marketing",
};

export default function DashboardLayout({ children }) {
  return (
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
  );
}
