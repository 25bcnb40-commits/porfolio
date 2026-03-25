const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI);

async function connectDB() {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
}

connectDB().catch(console.error);

// Feedback route
app.post("/feedback", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const db = client.db("portfolio");
        const collection = db.collection("feedback");

        await collection.insertOne({
            name,
            email,
            message,
            createdAt: new Date()
        });

        res.json({ message: "Feedback saved successfully!" });

    } catch (error) {
        console.error("Error saving feedback:", error);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
