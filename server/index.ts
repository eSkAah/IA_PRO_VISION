import express, { Express, Request, Response } from "express";
import screenshot from "screenshot-desktop";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import { analyzeImageByIA } from "./controllers/openai.controller";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Permet de gérer les requêtes CORS
app.use(express.json()); // Permet de parser le body des requêtes

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/capture", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json("Instructions manquantes");
    }

    // Capture l'écran actuel & sauvegarde en local
    const imgBuffer = await screenshot();

    const timestamp = Date.now();
    const filePath = path.join(
      `${__dirname}/screenshots`,
      `screenshot-${timestamp}.png`
    );
    const fp = path.join(`${__dirname}/screenshots`, `screen1.png`);

    fs.writeFileSync(filePath, imgBuffer);

    const data = await analyzeImageByIA({
      filePath: fp,
      prompt,
    });

    // Supprime l'image après analyse
    fs.unlinkSync(filePath);

    res.status(200).json({
      data,
      answer: data ? data.choices[0].message.content : "",
      message: "Image analysée avec succès",
    });
  } catch (error) {
    res.status(500).json("Erreur lors de la capture ou de l'analyse");
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
