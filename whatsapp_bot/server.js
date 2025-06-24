import express from "express";
import bodyParser from "body-parser";
import { appendToExcel } from "./utils/writeToExcel.js";
import { ApiError } from "./utils/ApiError.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import WhatsAppBot from "./utils/whatsappBot.js";
const app = express();
app.use(bodyParser.json());

// Initialize WhatsApp Bot
const whatsappBot = new WhatsAppBot();

// POST route to save user
app.post("/api/save-user", asyncHandler(async (req, res) => {
  try {
    const { name, contact, email, course, country, university } = req.body;

    const userData = { name, contact, email, course, country, university };
    const saved = await appendToExcel(userData);

    if (!saved) {
      // Duplicate found
      return res.status(409).json({
        statusCode: 409,
        message: "Duplicate entry: user with this email or contact already exists.",
        success: false
      });
    }

    const response = new ApiResponse(201,"User saved successfully",userData);
    return res.status(response.statusCode).json(response);
  } catch (err) {
    console.error(err);
    throw new ApiError(500, "Something went wrong while saving user")
  }
}));

// GET route to check bot status
app.get("/api/bot-status", (req, res) => {
  res.json({ 
    status: "running", 
    message: "WhatsApp Bot is active",
    commands: ["hello", "hi", "register", "help"],
    storage: "Excel only"
  });
});

app.listen(5000, async () => {
  console.log("Server running on port 5000");
  
  // Initialize WhatsApp Bot
  try {
    await whatsappBot.initialize();
    console.log("WhatsApp Bot initialized successfully");
  } catch (error) {
    console.error("Failed to initialize WhatsApp Bot:", error);
  }
});
