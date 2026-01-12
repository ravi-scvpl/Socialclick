"use client";
import React, { useState, useEffect } from "react";
import { getUser } from "@/lib/authHandlers";
import { TIME_ZONE } from "@/lib/constants";
import { CircularProgress, Sheet, Typography, Select, Option, Table } from "@mui/joy";
import { AreaLine } from "@/components/dashboard/graphing/AreaLine";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LanguageIcon from '@mui/icons-material/Language';
import PublicIcon from '@mui/icons-material/Public';
import DevicesIcon from '@mui/icons-material/Devices';
import WebIcon from '@mui/icons-material/Web';
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function LinkStats() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [user, setUser] = useState(null);
    const [timeRange, setTimeRange] = useState("30"); // Default 30 days

    useEffect(() => {
        async function fetchData() {
            const assignedUser = getUser();
            setUser(assignedUser);
            if (assignedUser && id) {
                try {
                    const res = await fetch(`/api/dash/links/${id}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            userId: assignedUser.id,
                            timeZone: TIME_ZONE,
                        }),
                    });
                    const info = await res.json();
                    if (info.message === "SUCCESS") {
                        setData(info.data);
                    } else {
                        console.error(info.message);
                    }
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <CircularProgress size="lg" />
            </div>
        );
    }

    if (!data) {
        return <div className="p-10">Link not found or error loading data.</div>;
    }

    const { link, totalClicks, humanClicks, dailyClicks, weeklyClicks, topCities, topCountries, topBrowsers, topOS, topReferrers, topSocialReferrers } = data;

    return (
        <main className="w-full h-full flex flex-col gap-6 p-6 overflow-y-scroll bg-[#FAFBFD]">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-black w-fit">
                    <ArrowBackIcon /> Back to Links
                </button>
                <div className="flex justify-between items-end">
                    <div>
                        <Typography level="h4" fontWeight="bold">Statistics for link</Typography>
                        <div className="flex gap-2 items-center text-sm text-gray-600">
                            <span className="text-teal-500">{link.shortURL}</span>
                            <a href={link.originalURL} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                                {link.originalURL} <LaunchIcon fontSize="small" />
                            </a>
                        </div>
                    </div>
                    <Select defaultValue="30" size="sm">
                        <Option value="7">Last 7 days</Option>
                        <Option value="30">Last 30 days</Option>
                        <Option value="90">Last 3 months</Option>
                    </Select>
                </div>
            </div>

            {/* Main Graph */}
            <Sheet variant="outlined" className="p-6 rounded-2xl shadow-sm bg-white">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <Typography level="title-lg">Clicks</Typography>
                    </div>
                    <Typography level="body-sm" className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        No statistics to show? Try visiting your link!
                    </Typography>
                </div>
                <div className="h-[300px] w-full flex justify-center">
                    {dailyClicks.length > 0 ? (
                        <AreaLine dailyClicks={dailyClicks} todaysClicks={0} type="daily" />
                    ) : (
                        <div className="grid place-items-center h-full text-gray-400">No data available</div>
                    )}
                </div>
            </Sheet>

            {/* Clicks Summary */}
            <div className="flex gap-6">
                <StatCard title="Total clicks" count={totalClicks} change="+1.2%" />
                <StatCard title="Human clicks" count={humanClicks} change="-0.4%" />
            </div>

            {/* Location Section */}
            <div className="flex flex-wrap gap-6">
                <ListCard title="Top cities" icon={<LanguageIcon />} data={topCities} colName="City" />
                <ListCard title="Top countries" icon={<PublicIcon />} data={topCountries} colName="Country" displayMap={true} />
            </div>

            {/* Tech Section */}
            <div className="flex flex-wrap gap-6">
                <ListCard title="Top browsers" icon={<WebIcon />} data={topBrowsers} colName="Browser" isProgress={true} />
                <ListCard title="Top operating systems" icon={<DevicesIcon />} data={topOS} colName="OS" isProgress={true} />
            </div>

            {/* Referrers Section */}
            <div className="flex flex-wrap gap-6">
                <ListCard title="Top referrers" icon={<LinkIcon />} data={topReferrers} colName="Referrer" />
                <ListCard title="Top social referrers" icon={<ShareIcon />} data={topSocialReferrers} colName="Social Network" />
            </div>

            <div className="h-10"></div>
        </main>
    );
}

function StatCard({ title, count, change }) {
    return (
        <Sheet variant="outlined" className="flex-1 p-6 rounded-2xl shadow-sm bg-white min-w-[300px]">
            <Typography level="title-md" className="mb-2">{title}</Typography>
            <div className="flex items-baseline gap-2">
                <Typography level="h2">{count}</Typography>
                {/* <span className="text-xs bg-green-100 text-green-700 px-1 rounded">{change}</span> (Placeholder) */}
            </div>
            <Typography level="body-xs" className="text-gray-400 mt-1">vs. previous period</Typography>
        </Sheet>
    )
}

function ListCard({ title, icon, data, colName, displayMap = false, isProgress = false }) {
    return (
        <Sheet variant="outlined" className="flex-1 p-6 rounded-2xl shadow-sm bg-white min-w-[400px]">
            <div className="flex justify-between items-start mb-4">
                <Typography level="title-md" className="flex items-center gap-2 mb-4">
                    {title}
                </Typography>
                {/* {displayMap && <div className="text-gray-300"><PublicIcon sx={{fontSize: 60}} /></div>} Spacer or Map Placeholder */}
            </div>

            <Table size="sm" borderAxis="none" className="[&_th]:font-normal [&_th]:text-gray-500">
                <thead>
                    <tr>
                        <th style={{ width: '60%' }}>{colName}</th>
                        <th className="text-right">Clicks</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? data.map((item, i) => (
                        <tr key={i}>
                            <td className="font-medium text-gray-700">
                                {isProgress ? (
                                    <div className="flex flex-col gap-1">
                                        <span>{item.name}</span>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 dark:bg-gray-200">
                                            <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                                        </div>
                                    </div>
                                ) : (
                                    item.name
                                )}
                            </td>
                            <td className="text-right">{item.value}</td>
                        </tr>
                    )) : (
                        <tr><td colSpan={2} className="text-center text-gray-400 py-4">No data</td></tr>
                    )}
                </tbody>
            </Table>
        </Sheet>
    )
}

// Simple Icons
function LinkIcon() { return <i className="fa-solid fa-link" /> }
function ShareIcon() { return <i className="fa-solid fa-share-nodes" /> }
function LaunchIcon({ fontSize }) { return <i className={`fa-solid fa-up-right-from-square text-[0.8em]`} /> }


