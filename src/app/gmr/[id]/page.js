"use client";

import { Sheet, Typography, Button, Table } from "@mui/joy";
import Link from "next/link";
import Image from "next/image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MouseTwoTone from "@mui/icons-material/MouseTwoTone";
import DevicesIcon from "@mui/icons-material/Devices";
import PublicIcon from '@mui/icons-material/Public';
import LanguageIcon from '@mui/icons-material/Language';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import WebIcon from '@mui/icons-material/Web';
import StorageIcon from '@mui/icons-material/Storage';

// Static Data Configuration with Top 10 Lists
const linkData = {
    "google": {
        name: "GMR GOOGLE LINK CLICK",
        destination: "https://google.com",
        metrics: {
            totalClicks: 5421,
            topBrowser: "Chrome (85%)",
            topCity: "Mumbai",
            topCountry: "India (90%)",
            topOS: "Android (70%)"
        },
        graphPoints: [
            { x: "Mon", y: 400 }, { x: "Tue", y: 650 }, { x: "Wed", y: 580 },
            { x: "Thu", y: 890 }, { x: "Fri", y: 1200 }, { x: "Sat", y: 900 }, { x: "Sun", y: 801 }
        ],
        browsers: [
            { name: "Chrome", val: 85 }, { name: "Safari", val: 8 }, { name: "Firefox", val: 3 },
            { name: "Edge", val: 2 }, { name: "Samsung Internet", val: 1 }, { name: "Opera", val: 0.5 },
            { name: "UC Browser", val: 0.2 }, { name: "Brave", val: 0.1 }, { name: "Vivaldi", val: 0.1 }, { name: "Other", val: 0.1 }
        ],
        cities: [
            { name: "Mumbai", val: 30 }, { name: "New Delhi", val: 25 }, { name: "Bangalore", val: 15 },
            { name: "Hyderabad", val: 10 }, { name: "Chennai", val: 5 }, { name: "Kolkata", val: 4 },
            { name: "Pune", val: 3 }, { name: "Ahmedabad", val: 3 }, { name: "Jaipur", val: 2 }, { name: "Surat", val: 3 }
        ],
        countries: [
            { name: "India", val: 90 }, { name: "USA", val: 5 }, { name: "UK", val: 2 },
            { name: "UAE", val: 1 }, { name: "Canada", val: 0.5 }, { name: "Singapore", val: 0.5 },
            { name: "Australia", val: 0.3 }, { name: "Germany", val: 0.3 }, { name: "France", val: 0.2 }, { name: "Other", val: 0.2 }
        ],
        os: [
            { name: "Android", val: 70 }, { name: "iOS", val: 20 }, { name: "Windows", val: 8 },
            { name: "MacOS", val: 1.5 }, { name: "Linux", val: 0.3 }, { name: "Chrome OS", val: 0.1 },
            { name: "Ubuntu", val: 0.05 }, { name: "Fedora", val: 0.02 }, { name: "Tizen", val: 0.02 }, { name: "Other", val: 0.01 }
        ]
    },
    "fb": {
        name: "GMR FB LINK CLICK",
        destination: "https://facebook.com",
        metrics: {
            totalClicks: 4102,
            topBrowser: "Safari (45%)",
            topCity: "New York",
            topCountry: "USA (40%)",
            topOS: "iOS (60%)"
        },
        graphPoints: [
            { x: "Mon", y: 300 }, { x: "Tue", y: 450 }, { x: "Wed", y: 400 },
            { x: "Thu", y: 600 }, { x: "Fri", y: 850 }, { x: "Sat", y: 700 }, { x: "Sun", y: 802 }
        ],
        browsers: [
            { name: "Safari", val: 45 }, { name: "Chrome", val: 40 }, { name: "Firefox", val: 10 },
            { name: "Edge", val: 3 }, { name: "Samsung Internet", val: 1 }, { name: "Opera", val: 0.5 },
            { name: "UC Browser", val: 0.2 }, { name: "Brave", val: 0.1 }, { name: "Vivaldi", val: 0.1 }, { name: "Other", val: 0.1 }
        ],
        cities: [
            { name: "New York", val: 25 }, { name: "Los Angeles", val: 20 }, { name: "Chicago", val: 15 },
            { name: "Houston", val: 10 }, { name: "Phoenix", val: 5 }, { name: "Philadelphia", val: 5 },
            { name: "San Antonio", val: 5 }, { name: "San Diego", val: 5 }, { name: "Dallas", val: 5 }, { name: "San Jose", val: 5 }
        ],
        countries: [
            { name: "USA", val: 40 }, { name: "India", val: 20 }, { name: "UK", val: 15 },
            { name: "Canada", val: 10 }, { name: "Australia", val: 5 }, { name: "Germany", val: 4 },
            { name: "France", val: 3 }, { name: "Brazil", val: 1 }, { name: "Japan", val: 1 }, { name: "Other", val: 1 }
        ],
        os: [
            { name: "iOS", val: 60 }, { name: "Android", val: 30 }, { name: "Windows", val: 8 },
            { name: "MacOS", val: 1.5 }, { name: "Linux", val: 0.3 }, { name: "Chrome OS", val: 0.1 },
            { name: "Ubuntu", val: 0.05 }, { name: "Fedora", val: 0.02 }, { name: "Tizen", val: 0.02 }, { name: "Other", val: 0.01 }
        ]
    },
    "display": {
        name: "GMR DISPLAY CLICK",
        destination: "http://worldairportsurvey.com/surveys/airport/best_airport.html",
        metrics: {
            totalClicks: 3020,
            topBrowser: "Chrome (60%)",
            topCity: "London",
            topCountry: "UK (35%)",
            topOS: "Windows (50%)"
        },
        graphPoints: [
            { x: "Mon", y: 200 }, { x: "Tue", y: 300 }, { x: "Wed", y: 250 },
            { x: "Thu", y: 400 }, { x: "Fri", y: 600 }, { x: "Sat", y: 550 }, { x: "Sun", y: 720 }
        ],
        browsers: [
            { name: "Chrome", val: 60 }, { name: "Edge", val: 20 }, { name: "Firefox", val: 10 },
            { name: "Safari", val: 5 }, { name: "Opera", val: 2 }, { name: "Samsung Internet", val: 1 },
            { name: "Brave", val: 1 }, { name: "Vivaldi", val: 0.5 }, { name: "UC Browser", val: 0.3 }, { name: "Other", val: 0.2 }
        ],
        cities: [
            { name: "London", val: 35 }, { name: "Manchester", val: 15 }, { name: "Birmingham", val: 10 },
            { name: "Glasgow", val: 8 }, { name: "Liverpool", val: 7 }, { name: "Bristol", val: 5 },
            { name: "Edinburgh", val: 5 }, { name: "Leeds", val: 5 }, { name: "Sheffield", val: 5 }, { name: "Other", val: 5 }
        ],
        countries: [
            { name: "UK", val: 35 }, { name: "USA", val: 20 }, { name: "Germany", val: 10 },
            { name: "France", val: 10 }, { name: "India", val: 5 }, { name: "Canada", val: 5 },
            { name: "Australia", val: 5 }, { name: "Italy", val: 4 }, { name: "Spain", val: 3 }, { name: "Other", val: 3 }
        ],
        os: [
            { name: "Windows", val: 50 }, { name: "MacOS", val: 20 }, { name: "Android", val: 15 },
            { name: "iOS", val: 10 }, { name: "Linux", val: 3 }, { name: "Chrome OS", val: 1 },
            { name: "Ubuntu", val: 0.5 }, { name: "Fedora", val: 0.2 }, { name: "Tizen", val: 0.2 }, { name: "Other", val: 0.1 }
        ]
    }
};

const BarList = ({ title, icon, data, colorClass }) => (
    <Sheet sx={{ p: 3, borderRadius: 'xl', boxShadow: 'md', bgcolor: 'white', height: '100%' }}>
        <Typography level="h4" mb={2} startDecorator={icon}>{title}</Typography>
        <div className="flex flex-col gap-3">
            {data.map((item, i) => (
                <div key={i}>
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-sm text-gray-500">{item.val}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className={`${colorClass} h-2.5 rounded-full`} style={{ width: `${item.val}%` }}></div>
                    </div>
                </div>
            ))}
        </div>
    </Sheet>
);

export default function GMRLinkStats({ params }) {
    const id = params.id;
    const data = linkData[id];

    if (!data) {
        return (
            <div className="h-screen flex items-center justify-center flex-col gap-4">
                <Typography level="h1">Link Not Found</Typography>
                <Link href="/gmr"><Button>Back to Dashboard</Button></Link>
            </div>
        );
    }

    return (
        <main className="w-full h-full flex flex-col gap-8 max-h-screen overflow-y-auto p-4 bg-gray-50">
            {/* Header */}
            <div className="flex flex-col gap-4 border-b pb-4">
                <Link href="/gmr" className="text-gray-500 hover:text-gray-800 flex items-center gap-1 w-fit">
                    <ArrowBackIcon fontSize="small" /> Back to Overview
                </Link>
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                            <Image
                                src="/images/Indira_Gandhi_International_Airport_Dashboard.png"
                                alt="Logo"
                                width={150}
                                height={60}
                                style={{ objectFit: "contain" }}
                            />
                        </div>
                        <div>
                            <Typography level="h2">{data.name}</Typography>
                            <Link href={data.destination} target="_blank" className="text-blue-500 hover:underline text-sm">
                                {data.destination}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'lg', bgcolor: 'white' }}>
                    <Typography level="body-sm" startDecorator={<MouseTwoTone />}>Total Clicks</Typography>
                    <Typography level="h3">{data.metrics.totalClicks.toLocaleString()}</Typography>
                </Sheet>
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'lg', bgcolor: 'white' }}>
                    <Typography level="body-sm" startDecorator={<WebIcon />}>Top Browser</Typography>
                    <Typography level="h3">{data.metrics.topBrowser}</Typography>
                </Sheet>
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'lg', bgcolor: 'white' }}>
                    <Typography level="body-sm" startDecorator={<LocationCityIcon />}>Top City</Typography>
                    <Typography level="h3">{data.metrics.topCity}</Typography>
                </Sheet>
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'lg', bgcolor: 'white' }}>
                    <Typography level="body-sm" startDecorator={<LanguageIcon />}>Top Country</Typography>
                    <Typography level="h3">{data.metrics.topCountry}</Typography>
                </Sheet>
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'lg', bgcolor: 'white' }}>
                    <Typography level="body-sm" startDecorator={<StorageIcon />}>Top OS</Typography>
                    <Typography level="h3">{data.metrics.topOS}</Typography>
                </Sheet>
            </div>

            {/* Main Graphs Area */}
            <div className="flex flex-col gap-6">

                {/* Click Performance Chart */}
                <Sheet sx={{ p: 3, borderRadius: 'xl', boxShadow: 'md', bgcolor: 'white' }} className="min-h-[400px]">
                    <Typography level="h4" mb={2}>Click Performance (Last 7 Days)</Typography>
                    <div className="h-[300px] flex items-end justify-between gap-2 px-4 pb-4 border-b">
                        {data.graphPoints.map((point, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 w-full">
                                <div
                                    className="w-full bg-blue-500 rounded-t-md hover:bg-blue-600 transition-all cursor-pointer relative group"
                                    style={{ height: `${(point.y / 1500) * 100}%` }}
                                >
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {point.y}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500 font-bold">{point.x}</span>
                            </div>
                        ))}
                    </div>
                </Sheet>

                {/* Top 10 Data Grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <BarList title="Top 10 Browsers" icon={<WebIcon />} data={data.browsers} colorClass="bg-indigo-500" />
                    <BarList title="Top 10 Cities" icon={<LocationCityIcon />} data={data.cities} colorClass="bg-green-500" />
                    <BarList title="Top 10 Countries" icon={<LanguageIcon />} data={data.countries} colorClass="bg-purple-500" />
                    <BarList title="Top 10 OS" icon={<StorageIcon />} data={data.os} colorClass="bg-orange-500" />
                </div>

            </div>
        </main>
    );
}
