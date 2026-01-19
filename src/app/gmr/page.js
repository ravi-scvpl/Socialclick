"use client";

import { Sheet, Typography, Button, Table } from "@mui/joy";
import Link from "next/link";
import Image from "next/image";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import MouseTwoTone from "@mui/icons-material/MouseTwoTone";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import DevicesIcon from "@mui/icons-material/Devices";
import PublicIcon from '@mui/icons-material/Public';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function GMRDashboard() {
    // Static Data
    const staticStats = {
        totalClicks: 12543,
        dailyClicks: 432,
        conversionRate: "4.8%",
        topLocation: "New Delhi, India"
    };

    const gmrLinks = [
        {
            id: "google",
            name: "GMR GOOGLE LINK CLICK",
            destination: "https://google.com",
            clicks: 5421,
            status: "Active"
        },
        {
            id: "fb",
            name: "GMR FB LINK CLICK",
            destination: "https://facebook.com",
            clicks: 4102,
            status: "Active"
        },
        {
            id: "display",
            name: "GMR DISPLAY CLICK",
            destination: "http://worldairportsurvey.com/surveys/airport/best_airport.html",
            clicks: 3020,
            status: "Active"
        }
    ];

    return (
        <main className="w-full h-full flex flex-col gap-8 max-h-screen overflow-y-auto p-4 bg-gray-50">
            {/* Header Section */}
            <div className="h-[120px] flex gap-4 items-center border-b pb-4">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Image
                        src="/images/Indira_Gandhi_International_Airport_Dashboard.png"
                        alt="Indira Gandhi International Airport"
                        width={200}
                        height={80}
                        style={{ objectFit: "contain" }}
                    />
                </div>
                <div>
                    <Typography sx={{ fontWeight: 700 }} className={"text-[2.5em] text-gray-800"}>
                        GMR Analytics
                    </Typography>
                    <Typography className={"text-[1em] text-gray-500"}>
                        Real-time campaign performance overview
                    </Typography>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="flex flex-wrap gap-4">
                <Sheet
                    variant="outlined"
                    sx={{
                        p: 2,
                        borderRadius: "lg",
                        flex: 1,
                        minWidth: "200px",
                        boxShadow: "sm",
                        bgcolor: "white"
                    }}
                >
                    <Typography level="title-sm" startDecorator={<MouseTwoTone />}>Total Clicks</Typography>
                    <Typography level="h2">{staticStats.totalClicks.toLocaleString()}</Typography>
                </Sheet>
                <Sheet
                    variant="outlined"
                    sx={{
                        p: 2,
                        borderRadius: "lg",
                        flex: 1,
                        minWidth: "200px",
                        boxShadow: "sm",
                        bgcolor: "white"
                    }}
                >
                    <Typography level="title-sm" startDecorator={<CompareArrowsIcon />}>Daily Active</Typography>
                    <Typography level="h2">{staticStats.dailyClicks}</Typography>
                </Sheet>
                <Sheet
                    variant="outlined"
                    sx={{
                        p: 2,
                        borderRadius: "lg",
                        flex: 1,
                        minWidth: "200px",
                        boxShadow: "sm",
                        bgcolor: "white"
                    }}
                >
                    <Typography level="title-sm" startDecorator={<PublicIcon />}>Top Location</Typography>
                    <Typography level="h2">{staticStats.topLocation}</Typography>
                </Sheet>
            </div>

            {/* Links Table Section */}
            <div className="flex flex-wrap gap-8">
                <Sheet
                    sx={{
                        minWidth: "350px",
                        boxShadow: "md",
                        padding: "24px",
                        borderRadius: "xl",
                    }}
                    className={"shadow-lg flex-1 bg-white"}
                >
                    <Typography
                        level="h3"
                        sx={{ mb: 3 }}
                        startDecorator={<EmojiEventsIcon color="warning" />}
                    >
                        Campaign Links
                    </Typography>

                    <Table hoverRow sx={{ '& thead th': { fontWeight: '700' } }}>
                        <thead>
                            <tr>
                                <th style={{ width: '40%' }}>Campaign Name</th>
                                <th>Destination URL</th>
                                <th>Clicks</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gmrLinks.map((link, i) => (
                                <tr key={i}>
                                    <td>
                                        <Typography fontWeight="lg">{link.name}</Typography>
                                    </td>
                                    <td className="truncate max-w-[200px]">
                                        <Link href={link.destination} target="_blank" className="text-blue-500 hover:underline">
                                            {link.destination}
                                        </Link>
                                    </td>
                                    <td>{link.clicks.toLocaleString()}</td>
                                    <td>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {link.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <Button
                                                component={Link}
                                                href={`/gmr/${link.id}`}
                                                size="sm"
                                                variant="outlined"
                                                color="neutral"
                                                startDecorator={<BarChartIcon />}
                                            >
                                                Stats
                                            </Button>
                                            <Button
                                                component="a"
                                                href={link.destination}
                                                target="_blank"
                                                size="sm"
                                                variant="soft"
                                                color="primary"
                                            >
                                                Visit
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Sheet>
            </div>

            {/* Footer / Disclaimer */}
            <div className="text-center text-gray-400 text-sm py-4">
                Data updated: Just now • GMR Internal Dashboard
            </div>
        </main>
    );
}
