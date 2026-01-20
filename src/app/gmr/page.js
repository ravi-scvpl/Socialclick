"use client";

import { Sheet, Typography, Table, Button } from "@mui/joy";
import Link from "next/link";
import Image from "next/image";
import MouseTwoTone from "@mui/icons-material/MouseTwoTone";
import PublicIcon from '@mui/icons-material/Public';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import WebIcon from '@mui/icons-material/Web';
import StorageIcon from '@mui/icons-material/Storage';
import { useState, useEffect } from "react";

export default function GMRStatsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch("/api/gmr", { cache: "no-store" });
                const json = await res.json();
                if (json.success) {
                    setData(json.data);
                }
            } catch (error) {
                console.error("Failed to load GMR data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div className="p-10 flex justify-center">Loading Dashboard...</div>;
    if (!data) return <div className="p-10 flex justify-center">Unable to load data.</div>;

    const { staticStats, gmrLinks } = data;

    return (
        <main className="w-full h-full flex flex-col gap-8 max-h-screen overflow-y-auto p-4 bg-gray-50">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4 border-b pb-4">
                <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Image
                            src="/images/Indira_Gandhi_International_Airport_Dashboard.png"
                            alt="Indira Gandhi International Airport"
                            width={200}
                            height={60}
                            style={{ objectFit: "contain" }}
                        />
                    </div>
                </div>
                <Typography level="h4" textColor="neutral.500">
                    Campaign Analytics
                </Typography>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'lg', bgcolor: 'white' }}>
                    <Typography level="body-sm" startDecorator={<MouseTwoTone />}>Total Clicks</Typography>
                    <Typography level="h3">{staticStats.totalClicks.toLocaleString()}</Typography>
                </Sheet>
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'lg', bgcolor: 'white' }}>
                    <Typography level="body-sm" startDecorator={<WebIcon />}>Top Browser</Typography>
                    <Typography level="h3">{staticStats.topBrowser}</Typography>
                </Sheet>
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'lg', bgcolor: 'white' }}>
                    <Typography level="body-sm" startDecorator={<LocationCityIcon />}>Top City</Typography>
                    <Typography level="h3">{staticStats.topCity}</Typography>
                </Sheet>
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'lg', bgcolor: 'white' }}>
                    <Typography level="body-sm" startDecorator={<PublicIcon />}>Top Country</Typography>
                    <Typography level="h3">{staticStats.topCountry}</Typography>
                </Sheet>
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'lg', bgcolor: 'white' }}>
                    <Typography level="body-sm" startDecorator={<StorageIcon />}>Top OS</Typography>
                    <Typography level="h3">{staticStats.topOS}</Typography>
                </Sheet>
            </div>

            {/* Campaign Links Table */}
            <Sheet variant="outlined" sx={{ borderRadius: 'lg', bgcolor: 'white', overflow: 'hidden' }}>
                <Table hoverRow size="lg">
                    <thead>
                        <tr>
                            <th style={{ width: '40%' }}>Campaign Name</th>
                            <th>Destination</th>
                            <th>Clicks</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gmrLinks.map((link) => (
                            <tr key={link.id}>
                                <td>
                                    <Typography fontWeight="lg">{link.name}</Typography>
                                </td>
                                <td className="text-gray-500 text-sm truncate max-w-[200px]">{link.destination}</td>
                                <td><b>{link.clicks.toLocaleString()}</b></td>
                                <td>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                        {link.status}
                                    </span>
                                </td>
                                <td>
                                    <Link href={`/gmr/${link.id}`}>
                                        <Button size="sm" variant="soft">Stats</Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Sheet>
        </main>
    );
}
