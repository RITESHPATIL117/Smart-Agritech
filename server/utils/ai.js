const { GoogleGenAI } = require('@google/genai');

let ai;

try {
  // Initialize only if the API key is present
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } else {
    console.warn('⚠️ GEMINI_API_KEY is missing in .env. AI features will fail.');
  }
} catch (error) {
  console.error('Failed to initialize Google Gen AI:', error);
}

const getGeminiResponse = async (prompt, systemInstruction = null) => {
  if (!ai) {
    throw new Error('Gemini API is not configured. Please add GEMINI_API_KEY to your .env file.');
  }

  const config = {
    responseMimeType: 'application/json',
  };

  if (systemInstruction) {
    config.systemInstruction = systemInstruction;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config,
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error('Failed to parse Gemini response as JSON:', response.text);
    throw new Error('Invalid JSON response from AI');
  }
};

const getGeminiVisionResponse = async (prompt, mimeType, fileBuffer) => {
  if (!ai) {
    throw new Error('Gemini API is not configured. Please add GEMINI_API_KEY to your .env file.');
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              data: fileBuffer.toString('base64'),
              mimeType,
            },
          },
          { text: prompt }
        ],
      }
    ],
    config: {
      responseMimeType: 'application/json',
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error('Failed to parse Gemini Vision response as JSON:', response.text);
    throw new Error('Invalid JSON response from AI');
  }
};

module.exports = {
  getGeminiResponse,
  getGeminiVisionResponse,
};
