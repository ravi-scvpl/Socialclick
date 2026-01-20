"use client";
import React, { useState, useEffect } from "react";
import {
    Table,
    Sheet,
    Typography,
    Button,
    Input,
    Modal,
    ModalDialog,
    FormControl,
    FormLabel,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    Textarea
} from "@mui/joy";
import { getUser } from "@/lib/authHandlers";

export default function AdminPage() {
    const [user, setUser] = useState(null);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLink, setSelectedLink] = useState(null); // For editing
    const [openEdit, setOpenEdit] = useState(false);

    // Traffic addition state
    const [clicksToAdd, setClicksToAdd] = useState(0);
    const [trafficData, setTrafficData] = useState({
        country: "",
        city: "",
        browser: "",
        device: "",
        referrer: "",
        date: ""
    });
    const [isAdding, setIsAdding] = useState(false);

    // GMR Data State
    const [gmrJson, setGmrJson] = useState("");
    const [loadingGmr, setLoadingGmr] = useState(false);
    const [savingGmr, setSavingGmr] = useState(false);

    useEffect(() => {
        const userData = getUser();
        if (!userData) {
            window.location.assign("/login");
            return;
        }
        if (userData.role !== "ADMIN") {
            window.location.assign("/dashboard"); // Redirect non-admins
            return;
        }
        setUser(userData);
        fetchLinks(userData.id);
        fetchGmrData();
    }, []);

    const fetchLinks = async (userId) => {
        try {
            const res = await fetch("/api/admin/links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            const data = await res.json();
            if (res.ok) {
                setLinks(data.data);
            } else {
                console.error("Failed to fetch links:", data.message);
            }
        } catch (error) {
            console.error("Error fetching links:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGmrData = async () => {
        setLoadingGmr(true);
        try {
            const res = await fetch("/api/gmr");
            const data = await res.json();
            if (data.success) {
                setGmrJson(JSON.stringify(data.data, null, 2));
            }
        } catch (error) {
            console.error("Error fetching GMR data:", error);
        } finally {
            setLoadingGmr(false);
        }
    };

    const handleSaveGmr = async () => {
        setSavingGmr(true);
        try {
            // Validate JSON
            let parsedData;
            try {
                parsedData = JSON.parse(gmrJson);
            } catch (e) {
                alert("Invalid JSON format");
                setSavingGmr(false);
                return;
            }

            const res = await fetch("/api/gmr", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: parsedData })
            });
            const result = await res.json();
            if (result.success) {
                alert("GMR Data Updated Successfully!");
            } else {
                alert("Failed to update: " + result.message);
            }
        } catch (error) {
            console.error("Error saving GMR data:", error);
            alert("Error saving data");
        } finally {
            setSavingGmr(false);
        }
    };

    const handleEditClick = (link) => {
        setSelectedLink(link);
        setClicksToAdd(0); // Default to 0 when opening
        setTrafficData({
            country: "",
            city: "",
            browser: "",
            device: "",
            referrer: "",
            date: new Date().toISOString().slice(0, 16) // Default to now
        });
        setOpenEdit(true);
    };

    const handleSaveStats = async () => {
        if (!selectedLink) return;
        setIsAdding(true);
        try {
            const res = await fetch(`/api/admin/links/${selectedLink.id}/stats`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    clicksToAdd: clicksToAdd,
                    trafficData: trafficData
                }),
            });

            if (res.ok) {
                setOpenEdit(false);
                fetchLinks(user.id); // Refresh list
            } else {
                const error = await res.json();
                alert("Failed to update: " + error.message);
            }
        } catch (error) {
            console.error("Error updating stats:", error);
            alert("Error updating stats");
        } finally {
            setIsAdding(false);
        }
    };

    if (loading) return <div className="p-10">Loading Admin Dashboard...</div>;

    return (
        <main className="h-screen w-full p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <Typography level="h2">Admin Dashboard</Typography>
                <div className="text-sm">Welcome, Admin {user?.name}</div>
            </div>

            <Tabs defaultValue={0} sx={{ borderRadius: 'lg' }}>
                <TabList>
                    <Tab>Link Management</Tab>
                    <Tab>GMR Data Editor</Tab>
                </TabList>
                <TabPanel value={0} sx={{ p: 2 }}>
                    <Sheet variant="outlined" sx={{ borderRadius: "md", overflow: "auto" }}>
                        <Table stickyHeader hoverRow>
                            <thead>
                                <tr>
                                    <th style={{ width: "20%" }}>Short URL</th>
                                    <th style={{ width: "25%" }}>Original URL</th>
                                    <th style={{ width: "15%" }}>Owner</th>
                                    <th style={{ width: "10%" }}>Clicks</th>
                                    <th style={{ width: "15%" }}>Created</th>
                                    <th style={{ width: "15%" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {links.map((link) => (
                                    <tr key={link.id}>
                                        <td>{link.shortURL}</td>
                                        <td className="truncate max-w-[200px]" title={link.originalURL}>
                                            {link.originalURL}
                                        </td>
                                        <td>{link.user?.email || "Unknown"}</td>
                                        <td>{link.clicks}</td>
                                        <td>{new Date(link.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="soft"
                                                onClick={() => handleEditClick(link)}
                                            >
                                                Edit Stats
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Sheet>
                </TabPanel>

                <TabPanel value={1} sx={{ p: 2 }}>
                    <div className="flex flex-col gap-4 max-w-4xl">
                        <div className="flex justify-between items-center">
                            <div>
                                <Typography level="h4">GMR Dynamic Config</Typography>
                                <Typography level="body-sm">Edit the JSON below to update stats, graphs, and Top 10 lists instantly.</Typography>
                            </div>
                            <Button onClick={handleSaveGmr} loading={savingGmr} color="primary">
                                Save GMR Data
                            </Button>
                        </div>

                        {loadingGmr ? (
                            <div>Loading JSON...</div>
                        ) : (
                            <Textarea
                                minRows={20}
                                maxRows={30}
                                value={gmrJson}
                                onChange={(e) => setGmrJson(e.target.value)}
                                sx={{
                                    fontFamily: 'monospace',
                                    fontSize: '14px',
                                    padding: '1rem',
                                    borderRadius: 'md'
                                }}
                            />
                        )}
                    </div>
                </TabPanel>
            </Tabs>

            <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
                <ModalDialog>
                    <Typography level="h4">Add Traffic</Typography>
                    <Typography level="body-sm" mb={2}>
                        For: {selectedLink?.shortURL}
                    </Typography>
                    <div className="flex flex-col gap-2 overflow-y-auto max-h-[70vh] p-1">
                        <FormControl>
                            <FormLabel>Clicks to Add</FormLabel>
                            <Input
                                type="number"
                                value={clicksToAdd}
                                onChange={(e) => setClicksToAdd(Number(e.target.value))}
                                placeholder="e.g 5"
                            />
                        </FormControl>
                        <div className="grid grid-cols-2 gap-2">
                            <FormControl>
                                <FormLabel>Country</FormLabel>
                                <Input
                                    placeholder="e.g United States"
                                    value={trafficData.country}
                                    onChange={(e) => setTrafficData({ ...trafficData, country: e.target.value })}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>City</FormLabel>
                                <Input
                                    placeholder="e.g New York"
                                    value={trafficData.city}
                                    onChange={(e) => setTrafficData({ ...trafficData, city: e.target.value })}
                                />
                            </FormControl>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <FormControl>
                                <FormLabel>Browser</FormLabel>
                                <Input
                                    placeholder="e.g Chrome"
                                    value={trafficData.browser}
                                    onChange={(e) => setTrafficData({ ...trafficData, browser: e.target.value })}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Device</FormLabel>
                                <Input
                                    placeholder="e.g Desktop"
                                    value={trafficData.device}
                                    onChange={(e) => setTrafficData({ ...trafficData, device: e.target.value })}
                                />
                            </FormControl>
                        </div>
                        <FormControl>
                            <FormLabel>Referrer URL</FormLabel>
                            <Input
                                placeholder="http://facebook.com"
                                value={trafficData.referrer}
                                onChange={(e) => setTrafficData({ ...trafficData, referrer: e.target.value })}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Date</FormLabel>
                            <Input
                                type="datetime-local"
                                value={trafficData.date}
                                onChange={(e) => setTrafficData({ ...trafficData, date: e.target.value })}
                            />
                        </FormControl>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="plain" color="neutral" onClick={() => setOpenEdit(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveStats} loading={isAdding} disabled={isAdding}>
                            {isAdding ? "Processing..." : "Add Traffic"}
                        </Button>
                    </div>
                </ModalDialog>
            </Modal>
        </main>
    );
}
