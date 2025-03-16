require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{ role: "user", parts: [{ text: userMessage }] }]
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        // Extract AI's response from Gemini API
        const aiReply = response.data.candidates[0].content.parts[0].text || "Sorry, I didn't understand that.";

        res.json({ reply: aiReply });
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "API request failed" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
