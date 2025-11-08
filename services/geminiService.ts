import { GoogleGenAI, Modality } from '@google/genai';
import type { AspectRatio } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder.");
    process.env.API_KEY = import.metA.env.VITE_API_KEY;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateImageWithFlash = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: { responseModalities: [Modality.IMAGE] },
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        if (part?.inlineData) {
            return part.inlineData.data;
        }
        throw new Error("No image data found in response from gemini-2.5-flash-image.");
    } catch (error) {
        console.error("Error generating image with gemini-2.5-flash-image:", error);
        throw error;
    }
};

export const generateImageWithImagen = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A high-quality, photorealistic image of: ${prompt}`,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: aspectRatio,
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        }
        throw new Error("No image data found in Imagen response.");
    } catch (error) {
        console.error("Error generating image with imagen-4.0-generate-001:", error);
        throw error;
    }
};

export const editImageWithFlash = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: base64Image, mimeType } },
                    { text: prompt },
                ],
            },
            config: { responseModalities: [Modality.IMAGE] },
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        if (part?.inlineData) {
            return part.inlineData.data;
        }
        throw new Error("No edited image data found in response.");
    } catch (error) {
        console.error("Error editing image with gemini-2.5-flash-image:", error);
        throw error;
    }
};
