"use client";

import { Sheet, Typography, Button, Table } from "@mui/joy";
import Link from "next/link";
import Image from "next/image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MouseTwoTone from "@mui/icons-material/MouseTwoTone";
import DevicesIcon from "@mui/icons-material/Devices";
import PublicIcon from '@mui/icons-material/Public';
import LanguageIcon from '@mui/icons-material/Language';

// Static Data Configuration
const linkData = {
    "google": {
        name: "GMR GOOGLE LINK CLICK",
        destination: "https://google.com",
        metrics: {
            totalClicks: 5421,
            uniqueClicks: 4100,
            topCountry: "India (85%)",
            topDevice: "Mobile (62%)"
        },
        graphPoints: [
            { x: "Mon", y: 400 }, { x: "Tue", y: 650 }, { x: "Wed", y: 580 },
            { x: "Thu", y: 890 }, { x: "Fri", y: 1200 }, { x: "Sat", y: 900 }, { x: "Sun", y: 801 }
        ],
        devices: [{ name: "Mobile", val: 62 }, { name: "Desktop", val: 30 }, { name: "Tablet", val: 8 }]
    },
    "fb": {
        name: "GMR FB LINK CLICK",
        destination: "https://facebook.com",
        metrics: {
            totalClicks: 4102,
            uniqueClicks: 2980,
            topCountry: "USA (40%)",
            topDevice: "Mobile (90%)"
        },
        graphPoints: [
            { x: "Mon", y: 300 }, { x: "Tue", y: 450 }, { x: "Wed", y: 400 },
            { x: "Thu", y: 600 }, { x: "Fri", y: 850 }, { x: "Sat", y: 700 }, { x: "Sun", y: 802 }
        ],
        devices: [{ name: "Mobile", val: 90 }, { name: "Desktop", val: 5 }, { name: "Tablet", val: 5 }]
    },
    "display": {
        name: "GMR DISPLAY CLICK",
        destination: "http://worldairportsurvey.com/surveys/airport/best_airport.html",
        metrics: {
            totalClicks: 3020,
            uniqueClicks: 2100,
            topCountry: "UK (35%)",
            topDevice: "Desktop (55%)"
        },
        graphPoints: [
            { x: "Mon", y: 200 }, { x: "Tue", y: 300 }, { x: "Wed", y: 250 },
            { x: "Thu", y: 400 }, { x: "Fri", y: 600 }, { x: "Sat", y: 550 }, { x: "Sun", y: 720 }
        ],
        devices: [{ name: "Mobile", val: 40 }, { name: "Desktop", val: 55 }, { name: "Tablet", val: 5 }]
    }
};

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
                    <Button component="a" href={data.destination} target="_blank">Visit Destination</Button>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'lg', bgcolor: 'white' }}>
                    <Typography level="body-sm" startDecorator={<MouseTwoTone />}>Total Clicks</Typography>
                    <Typography level="h3">{data.metrics.totalClicks.toLocaleString()}</Typography>
                </Sheet>
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'lg', bgcolor: 'white' }}>
                    <Typography level="body-sm" startDecorator={<MouseTwoTone />}>Unique Clicks</Typography>
                    <Typography level="h3">{data.metrics.uniqueClicks.toLocaleString()}</Typography>
                </Sheet>
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'lg', bgcolor: 'white' }}>
                    <Typography level="body-sm" startDecorator={<PublicIcon />}>Top Country</Typography>
                    <Typography level="h3">{data.metrics.topCountry}</Typography>
                </Sheet>
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'lg', bgcolor: 'white' }}>
                    <Typography level="body-sm" startDecorator={<DevicesIcon />}>Top Device</Typography>
                    <Typography level="h3">{data.metrics.topDevice}</Typography>
                </Sheet>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Mock Chart Area */}
                <Sheet sx={{ p: 3, borderRadius: 'xl', boxShadow: 'md', bgcolor: 'white' }} className="lg:col-span-2 min-h-[400px]">
                    <Typography level="h4" mb={2}>Click Performance (Last 7 Days)</Typography>

                    {/* Simple CSS Bar Chart for Mock Visual */}
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

                {/* Device Distribution */}
                <Sheet sx={{ p: 3, borderRadius: 'xl', boxShadow: 'md', bgcolor: 'white' }}>
                    <Typography level="h4" mb={2}>Device Breakdown</Typography>
                    <div className="flex flex-col gap-4">
                        {data.devices.map((device, i) => (
                            <div key={i}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">{device.name}</span>
                                    <span className="text-sm text-gray-500">{device.val}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${device.val}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
                        <Typography level="title-sm" mb={1} startDecorator={<LanguageIcon />}>Geographic Data</Typography>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm"><span>India</span> <span>45%</span></div>
                            <div className="flex justify-between text-sm"><span>USA</span> <span>30%</span></div>
                            <div className="flex justify-between text-sm"><span>UK</span> <span>15%</span></div>
                            <div className="flex justify-between text-sm"><span>Other</span> <span>10%</span></div>
                        </div>
                    </div>
                </Sheet>

            </div>
        </main>
    );
}
