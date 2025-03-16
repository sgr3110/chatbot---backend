require('dotenv').config();   // Loads variables from .env
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

// Read the Gemini API key from .env
// Make sure your .env file has a line like: GEMINI_API_KEY=your_key_here
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// POST endpoint for the chatbot
app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        // Call the Google Gemini API
        // NOTE: Check the correct endpoint and request format in the official docs
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText?key=${GEMINI_API_KEY}`,
            {
                prompt: { text: userMessage }
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        // Extract the AI reply from the API response
        // Adjust this based on the actual response structure
        const aiReply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn't understand that.";

        // Send the AI reply back to the frontend
        res.json({ reply: aiReply });
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ error: "API request failed" });
    }
});

// Start the server on port 5000 or environment port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
