import console from "console";
import dotenv from "dotenv";
import fs from "fs";
import OpenAI from "openai";
import { PROMPT_LIST } from "../utils/promptList";

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
  const formatedPrompt = PROMPT_LIST.poker.prompt.replace("#VALUE#", prompt);

  try {
    //Description de l'image full détaillée
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: formatedPrompt },
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

    //Passage de la réponse a GPT4
    console.log("response", response);

    return response;
  } catch (error) {
    console.error(error);
  }
};
