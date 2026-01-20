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
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/joy/IconButton';

const ListEditor = ({ title, data, onSave }) => {
    const [list, setList] = useState(data || []);

    // Sync local state when prop data changes (e.g. switching links)
    useEffect(() => {
        setList(data || []);
    }, [data]);

    const handleChange = (index, field, value) => {
        const newList = [...list];
        newList[index][field] = value;
        setList(newList);
        onSave(newList);
    };

    const handleDelete = (index) => {
        const newList = list.filter((_, i) => i !== index);
        setList(newList);
        onSave(newList);
    };

    const handleAdd = () => {
        const newList = [...list, { name: "", val: 0 }];
        setList(newList);
        onSave(newList);
    };

    return (
        <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'sm' }}>
            <div className="flex justify-between items-center mb-2">
                <Typography level="title-md">{title}</Typography>
                <IconButton size="sm" onClick={handleAdd} color="success" variant="soft"><AddIcon /></IconButton>
            </div>
            <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
                {list.map((item, i) => (
                    <div key={i} className="flex gap-2 items-center">
                        <Input
                            size="sm"
                            placeholder="Name"
                            value={item.name}
                            onChange={(e) => handleChange(i, 'name', e.target.value)}
                            sx={{ flex: 1 }}
                        />
                        <Input
                            size="sm"
                            type="number"
                            placeholder="Val"
                            value={item.val}
                            onChange={(e) => handleChange(i, 'val', Number(e.target.value))}
                            sx={{ width: '80px' }}
                        />
                        <IconButton size="sm" color="danger" variant="plain" onClick={() => handleDelete(i)}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                ))}
            </div>
        </Sheet>
    );
};

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

    // Daily Log State
    const [logEntry, setLogEntry] = useState({
        linkId: "google",
        date: new Date().toISOString().slice(0, 10),
        clicks: 0
    });

    const updateList = (linkId, listName, newList) => {
        if (!gmrJson) return;
        try {
            let data = JSON.parse(gmrJson);
            if (data.linkData && data.linkData[linkId]) {
                data.linkData[linkId][listName] = newList;
                setGmrJson(JSON.stringify(data, null, 2));
            }
        } catch (e) {
            console.error("Error updating list", e);
        }
    };

    const handleAddDailyLog = async () => {
        if (!gmrJson) return;
        try {
            let data = JSON.parse(gmrJson);
            const { linkId, date, clicks } = logEntry;

            if (!data.linkData[linkId]) {
                alert("Link ID not found in JSON data");
                return;
            }

            // 1. Update Graph Points
            let points = data.linkData[linkId].graphPoints || [];
            const existingIndex = points.findIndex(p => p.x === date);

            if (existingIndex > -1) {
                // Update existing date
                points[existingIndex].y = clicks;
            } else {
                // Add new date
                points.push({ x: date, y: clicks });
                // Sort by date logic (simple string sort for YYYY-MM-DD works)
                points.sort((a, b) => a.x.localeCompare(b.x));
            }
            data.linkData[linkId].graphPoints = points;

            // 2. Update Total Clicks (Sum of all graph points)
            const newTotal = points.reduce((sum, p) => sum + p.y, 0);
            data.linkData[linkId].metrics.totalClicks = newTotal;

            // 3. Update Main Table Clicks
            const linkIndex = data.gmrLinks.findIndex(l => l.id === linkId);
            if (linkIndex > -1) {
                data.gmrLinks[linkIndex].clicks = newTotal;
            }

            // 4. Update Static Stats Total (Sum of all links)
            let allLinksTotal = 0;
            data.gmrLinks.forEach(l => allLinksTotal += l.clicks);
            data.staticStats.totalClicks = allLinksTotal;

            // Update State & Save
            const newJson = JSON.stringify(data, null, 2);
            setGmrJson(newJson);

            // Trigger Save API
            setSavingGmr(true);
            const res = await fetch("/api/gmr", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: data })
            });
            const result = await res.json();
            if (result.success) {
                alert(`Log Added! Total Updated to ${newTotal}`);
            } else {
                alert("Failed to save log: " + result.message);
            }

        } catch (error) {
            console.error("Error adding log:", error);
            alert("Error processing JSON data");
        } finally {
            setSavingGmr(false);
        }
    };

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

                        {/* Daily Entry Form */}
                        <Sheet variant="outlined" sx={{ p: 3, borderRadius: 'md', bgcolor: 'background.level1' }}>
                            <Typography level="h4" mb={2}>Add Daily Log</Typography>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <FormControl>
                                    <FormLabel>Link</FormLabel>
                                    <select
                                        className="p-2 rounded-md border border-gray-300"
                                        value={logEntry.linkId}
                                        onChange={(e) => setLogEntry({ ...logEntry, linkId: e.target.value })}
                                    >
                                        <option value="google">Google Link</option>
                                        <option value="fb">Facebook Link</option>
                                        <option value="display">Display Link</option>
                                    </select>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Date</FormLabel>
                                    <Input
                                        type="date"
                                        value={logEntry.date}
                                        onChange={(e) => setLogEntry({ ...logEntry, date: e.target.value })}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Clicks</FormLabel>
                                    <Input
                                        type="number"
                                        value={logEntry.clicks}
                                        onChange={(e) => setLogEntry({ ...logEntry, clicks: Number(e.target.value) })}
                                    />
                                </FormControl>
                                <Button onClick={handleAddDailyLog} color="success">Add Log</Button>
                            </div>
                        </Sheet>

                        <div className="flex justify-between items-center mt-4">
                            <div>
                                <Typography level="h4">Raw Configuration</Typography>
                                <Typography level="body-sm">Advanced: Edit JSON directly.</Typography>
                            </div>
                            <Button onClick={handleSaveGmr} loading={savingGmr} color="primary">
                                Save Full JSON
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
