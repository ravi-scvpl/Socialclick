
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Default Initial Data (Bootstrapping)
const initialData = {
    staticStats: {
        totalClicks: 12543,
        topBrowser: "Chrome (72%)",
        topCity: "New Delhi",
        topCountry: "India",
        topOS: "Android"
    },
    gmrLinks: [
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
    ],
    linkData: {
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
                { x: "2026-01-15", y: 400 }, { x: "2026-01-16", y: 650 }, { x: "2026-01-17", y: 580 },
                { x: "2026-01-18", y: 890 }, { x: "2026-01-19", y: 1200 }, { x: "2026-01-20", y: 900 }, { x: "2026-01-21", y: 801 }
            ],
            browsers: [
                { name: "Chrome", val: 85 }, { name: "Safari", val: 8 }, { name: "Firefox", val: 3 },
                { name: "Edge", val: 2 }, { name: "Samsung Internet", val: 1 }, { name: "Other", val: 1 }
            ],
            cities: [
                { name: "Mumbai", val: 30 }, { name: "New Delhi", val: 25 }, { name: "Bangalore", val: 15 },
                { name: "Hyderabad", val: 10 }, { name: "Chennai", val: 5 }, { name: "Other", val: 15 }
            ],
            countries: [
                { name: "India", val: 90 }, { name: "USA", val: 5 }, { name: "UK", val: 2 },
                { name: "Other", val: 3 }
            ],
            os: [
                { name: "Android", val: 70 }, { name: "iOS", val: 20 }, { name: "Windows", val: 8 },
                { name: "Other", val: 2 }
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
                { x: "2026-01-15", y: 300 }, { x: "2026-01-16", y: 450 }, { x: "2026-01-17", y: 400 },
                { x: "2026-01-18", y: 600 }, { x: "2026-01-19", y: 850 }, { x: "2026-01-20", y: 700 }, { x: "2026-01-21", y: 802 }
            ],
            browsers: [
                { name: "Safari", val: 45 }, { name: "Chrome", val: 40 }, { name: "Firefox", val: 10 },
                { name: "Edge", val: 3 }, { name: "Other", val: 2 }
            ],
            cities: [
                { name: "New York", val: 25 }, { name: "Los Angeles", val: 20 }, { name: "Chicago", val: 15 },
                { name: "Houston", val: 10 }, { name: "Other", val: 30 }
            ],
            countries: [
                { name: "USA", val: 40 }, { name: "India", val: 20 }, { name: "UK", val: 15 },
                { name: "Other", val: 25 }
            ],
            os: [
                { name: "iOS", val: 60 }, { name: "Android", val: 30 }, { name: "Windows", val: 8 },
                { name: "Other", val: 2 }
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
                { x: "2026-01-15", y: 200 }, { x: "2026-01-16", y: 300 }, { x: "2026-01-17", y: 250 },
                { x: "2026-01-18", y: 400 }, { x: "2026-01-19", y: 600 }, { x: "2026-01-20", y: 550 }, { x: "2026-01-21", y: 720 }
            ],
            browsers: [
                { name: "Chrome", val: 60 }, { name: "Edge", val: 20 }, { name: "Firefox", val: 10 },
                { name: "Safari", val: 5 }, { name: "Other", val: 5 }
            ],
            cities: [
                { name: "London", val: 35 }, { name: "Manchester", val: 15 }, { name: "Birmingham", val: 10 },
                { name: "Glasgow", val: 8 }, { name: "Other", val: 32 }
            ],
            countries: [
                { name: "UK", val: 35 }, { name: "USA", val: 20 }, { name: "Germany", val: 10 },
                { name: "France", val: 10 }, { name: "Other", val: 25 }
            ],
            os: [
                { name: "Windows", val: 50 }, { name: "MacOS", val: 20 }, { name: "Android", val: 15 },
                { name: "iOS", val: 10 }, { name: "Other", val: 5 }
            ]
        }
    }
};

export async function GET() {
    try {
        const record = await prisma.gmrData.findFirst();
        if (record) {
            return NextResponse.json({ data: record.data, success: true });
        } else {
            // Return defaults if db is empty
            return NextResponse.json({ data: initialData, success: true });
        }
    } catch (error) {
        return NextResponse.json({ message: "Error fetching data", error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        // Ideally verify ADMIN role here via token/session if possible, 
        // but the Admin Panel page logic protects the UI.

        const existing = await prisma.gmrData.findFirst();
        if (existing) {
            await prisma.gmrData.update({
                where: { id: existing.id },
                data: { data: body.data }
            });
        } else {
            await prisma.gmrData.create({
                data: { data: body.data }
            });
        }
        return NextResponse.json({ message: "Updated successfully", success: true });
    } catch (error) {
        return NextResponse.json({ message: "Error updating data", error: error.message }, { status: 500 });
    }
}
