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
import { useState, useEffect } from "react";

const BarList = ({ title, icon, data, colorClass }) => {
    // Calculate max value for relative bar sizing
    const maxVal = Math.max(...data.map(d => d.val), 100);

    return (
        <Sheet sx={{ p: 3, borderRadius: 'xl', boxShadow: 'md', bgcolor: 'white', height: '100%' }}>
            <Typography level="h4" mb={2} startDecorator={icon}>{title}</Typography>
            <div className="flex flex-col gap-3">
                {data.map((item, i) => (
                    <div key={i}>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{item.name}</span>
                            <span className="text-sm text-gray-500">{item.val.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                                className={`${colorClass} h-2.5 rounded-full`}
                                style={{ width: `${(item.val / maxVal) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </Sheet>
    );
};

export default function GMRLinkStats({ params }) {
    const id = params.id;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState("7D");

    // Helper to strip percentages like "(90%)"
    const cleanMetric = (val) => {
        if (typeof val !== 'string') return val;
        return val.replace(/\s*\(\d+%\)/, '');
    };

    // Static data for the graph as requested
    const staticGraphData = [
        { x: '2024-01-20', y: 1200 },
        { x: '2024-01-21', y: 1560 },
        { x: '2024-01-22', y: 1890 },
        { x: '2024-01-23', y: 2320 },
        { x: '2024-01-24', y: 1950 },
        { x: '2024-01-25', y: 3400 },
        { x: '2024-01-26', y: 2800 }
    ];

    // Helper to get top metric from list
    const getTopMetric = (list, fallback) => {
        if (list && list.length > 0) {
            return list[0].name;
        }
        return cleanMetric(fallback);
    };

    // Filter Logic - Returning Static Data for now
    const getFilteredPoints = () => {
        return staticGraphData;
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch("/api/gmr", { cache: "no-store" });
                const json = await res.json();
                if (json.success && json.data.linkData && json.data.linkData[id]) {
                    setData(json.data.linkData[id]);
                }
            } catch (error) {
                console.error("Failed to load GMR detail data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    if (loading) return <div className="p-10 flex justify-center">Loading Stats...</div>;

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
                            <Link href="https://worldairportsurvey.com/surveys/airport/best_airport.html" target="_blank" className="text-blue-500 hover:underline text-sm break-all">
                                https://worldairportsurvey.com/surveys/airport/best_airport.html
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
                    <Typography level="h3">{getTopMetric(data.browsers, data.metrics.topBrowser)}</Typography>
                </Sheet>
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'lg', bgcolor: 'white' }}>
                    <Typography level="body-sm" startDecorator={<LocationCityIcon />}>Top City</Typography>
                    <Typography level="h3">{getTopMetric(data.cities, data.metrics.topCity)}</Typography>
                </Sheet>
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'lg', bgcolor: 'white' }}>
                    <Typography level="body-sm" startDecorator={<LanguageIcon />}>Top Country</Typography>
                    <Typography level="h3">{getTopMetric(data.countries, data.metrics.topCountry)}</Typography>
                </Sheet>
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'lg', bgcolor: 'white' }}>
                    <Typography level="body-sm" startDecorator={<StorageIcon />}>Top OS</Typography>
                    <Typography level="h3">{getTopMetric(data.os, data.metrics.topOS)}</Typography>
                </Sheet>
            </div>

            {/* Main Graphs Area */}
            <div className="flex flex-col gap-6">

                {/* Click Performance Chart */}
                <Sheet sx={{ p: 3, borderRadius: 'xl', boxShadow: 'md', bgcolor: 'white' }} className="min-h-[400px]">
                    <div className="flex justify-between items-center mb-4">
                        <Typography level="h4">Click Performance</Typography>
                        <div className="flex bg-gray-100 p-1 rounded-md">
                            {['24H', '7D', '1M', '1Y'].map(range => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-3 py-1 text-sm rounded-sm transition-all ${timeRange === range ? 'bg-white shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-[300px] flex items-end justify-between gap-2 px-4 pb-4 border-b">
                        {getFilteredPoints().map((point, i) => {
                            const formatDate = (dateStr) => {
                                const date = new Date(dateStr);
                                if (isNaN(date.getTime())) return dateStr;
                                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            };

                            // Calculate height relative to max in this set (min 100 for safety)
                            const maxY = Math.max(...getFilteredPoints().map(p => p.y), 100);
                            const height = (point.y / maxY) * 100;

                            return (
                                <div key={i} className="flex flex-col items-center gap-2 w-full h-full justify-end">
                                    <div
                                        className="w-full bg-blue-500 rounded-t-md hover:bg-blue-600 transition-all cursor-pointer relative group"
                                        style={{ height: `${height}%` }}
                                    >
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {point.y.toLocaleString()} clicks <br /> {point.x}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500 font-bold whitespace-nowrap">{formatDate(point.x)}</span>
                                </div>
                            );
                        })}
                    </div>
                </Sheet>

                {/* Top 10 Data Grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <BarList title="Top Browsers" icon={<WebIcon />} data={data.browsers} colorClass="bg-indigo-500" />
                    <BarList title="Top Cities" icon={<LocationCityIcon />} data={data.cities} colorClass="bg-green-500" />
                    <BarList title="Top Countries" icon={<LanguageIcon />} data={data.countries} colorClass="bg-purple-500" />
                    <BarList title="Top OS" icon={<StorageIcon />} data={data.os} colorClass="bg-orange-500" />
                </div>

            </div>
        </main>
    );
}
