import console from "console";
import dotenv from "dotenv";
import fs from "fs";
import OpenAI from "openai";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

interface IAnalyzeImageByIAProps {
  filePath: string;
  prompt: string;
}

// Fonction pour encoder l'image en base64
function encodeImageToBase64(filePath: string) {
  const imageBuffer = fs.readFileSync(filePath);
  return imageBuffer.toString("base64");
}

export const analyzeImageByIA = async ({
  filePath,
  prompt,
}: IAnalyzeImageByIAProps) => {
  const base64Image = encodeImageToBase64(filePath);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};
