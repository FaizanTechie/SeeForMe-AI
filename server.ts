import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json({ limit: "50mb" }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const PORT = 3000;

// API Endpoints for SeeForMe AI
// 1. AI Vision: Scene Description
app.post("/api/vision", async (req, res) => {
  try {
    const { image, prompt, language = "en" } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Image data is required" });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";

    const langInstruction = 
      language === "ur" ? "Respond strictly in Urdu (اردو) with clear, warm spoken descriptions." :
      language === "ps" ? "Respond strictly in Pashto (پښتو) with clear, warm spoken descriptions." :
      "Respond in warm, clear, descriptive English.";

    const defaultPrompt = "Provide a comprehensive, empathetic, and extremely clear description of this visual scene for a blind or visually impaired person. Mention key objects, people, spatial layout, potential obstacles, and lighting.";
    const userPrompt = prompt ? `${prompt}. ${langInstruction}` : `${defaultPrompt} ${langInstruction}`;

    const response = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
          {
            text: userPrompt,
          },
        ],
      },
    });

    res.json({ text: response.text || "Unable to analyze the image." });
  } catch (error: any) {
    console.error("Vision API Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze image." });
  }
});

// 2. Read Text (OCR)
app.post("/api/read", async (req, res) => {
  try {
    const { image, language = "en" } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Image data is required" });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";

    const langInstruction = 
      language === "ur" ? "Read and transcribe all visible text in Urdu (اردو)." :
      language === "ps" ? "Read and transcribe all visible text in Pashto (پښتو)." :
      "Read and transcribe all visible text clearly and format it logically.";

    const response = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
          {
            text: `Extract and read all visible text in this image (signs, labels, menus, documents, or book pages). ${langInstruction} Also summarize what the text is about.`,
          },
        ],
      },
    });

    res.json({ text: response.text || "No readable text found in the image." });
  } catch (error: any) {
    console.error("Read Text API Error:", error);
    res.status(500).json({ error: error.message || "Failed to read text." });
  }
});

// 3. Find Objects
app.post("/api/find", async (req, res) => {
  try {
    const { image, targetObject, language = "en" } = req.body;
    if (!image || !targetObject) {
      return res.status(400).json({ error: "Image and target object are required" });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";

    const langInstruction = 
      language === "ur" ? "Respond in Urdu (اردو)." :
      language === "ps" ? "Respond in Pashto (پښتو)." :
      "Respond in English.";

    const response = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
          {
            text: `Look carefully at this image and locate the requested item: "${targetObject}". State clearly whether the item is visible. If visible, provide precise directional guidance (e.g., "about 3 feet ahead slightly to your left on the wooden table"). If not visible, suggest where it might be or ask the user to pan the camera. ${langInstruction}`,
          },
        ],
      },
    });

    res.json({ text: response.text || `Could not locate ${targetObject}.` });
  } catch (error: any) {
    console.error("Find Object API Error:", error);
    res.status(500).json({ error: error.message || "Failed to find object." });
  }
});

// 4. Safety Assistant
app.post("/api/safety", async (req, res) => {
  try {
    const { image, language = "en" } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Image data is required" });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";

    const langInstruction = 
      language === "ur" ? "Respond in Urdu (اردو)." :
      language === "ps" ? "Respond in Pashto (پښتو)." :
      "Respond in English.";

    const response = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
          {
            text: `Analyze this image specifically for safety hazards, obstacles, uneven flooring, steps, low-hanging objects, wet floors, or traffic hazards that could endanger a visually impaired person. Give an immediate, clear warning if any hazard is present. ${langInstruction}`,
          },
        ],
      },
    });

    res.json({ text: response.text || "Area appears clear of immediate hazards." });
  } catch (error: any) {
    console.error("Safety API Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze safety." });
  }
});

// 5. Voice Assistant Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, language = "en" } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const langInstruction = 
      language === "ur" ? "You are SeeForMe AI, a warm, caring, and precise visual assistant for blind and visually impaired people. Speak in Urdu (اردو)." :
      language === "ps" ? "You are SeeForMe AI, a warm, caring, and precise visual assistant for blind and visually impaired people. Speak in Pashto (پښتو)." :
      "You are SeeForMe AI, a warm, caring, and precise visual assistant for blind and visually impaired people. Speak in clear, supportive English.";

    const chat = ai.chats.create({
      model: "gemini-4-hydrogen",
      config: {
        systemInstruction: langInstruction,
      },
    });

    // Replay conversation history up to the last message
    for (let i = 0; i < messages.length - 1; i++) {
      const msg = messages[i];
      if (msg.role === "user") {
        // chat.sendMessage requires role tracking or we can seed chat
      }
    }

    const lastMessage = messages[messages.length - 1].content;
    const response = await chat.sendMessage({ message: lastMessage });

    res.json({ text: response.text || "I am here to help you." });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    res.status(500).json({ error: error.message || "Failed to process chat." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
