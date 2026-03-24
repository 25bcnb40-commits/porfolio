const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Feedback route
app.post("/feedback", (req, res) => {
    const feedbackData = req.body;

    const filePath = path.join(__dirname, "feedback.json");

    let feedbackList = [];

    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        feedbackList = JSON.parse(data);
    }

    feedbackList.push(feedbackData);

    fs.writeFileSync(filePath, JSON.stringify(feedbackList, null, 2));

    res.json({ message: "Feedback saved successfully!" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});