const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @function generateTimelineFromGemini
 * @desc Uses Gemini (Google Generative AI) to analyze a text and extract historical events.
 *       The function returns a list of events in JSON format with specific year-based dates and simple summaries.
 * 
 * @param {string} text - A block of historical or descriptive text to analyze.
 * @returns {Promise<Array<{date: string, summary: string}>>} - A list of timeline events.
 */

async function generateTimelineFromGemini(text) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert historian and timeline creator, focused on extracting all historical events.
      Please provide ONLY a JSON array of events in this exact format:

      [
        { "date": "YYYY", "summary": "Simple 1–3 line summary in plain language that explains the event's importance and key facts." },
        ...
      ]

      Analyze the following text and extract ALL important historical events. For each event, provide the date in one of these formats ONLY:
      - "YYYY" (e.g., "2020", "1945")
      - "YYYY BC" (e.g., "1000 BC", "44 BC")

      STRICT RULES:
      - Do NOT use months, centuries, decades, or vague time periods (e.g., "May 2020", "7th century", "1800s", "the 20th century", "the 1990s", "ancient times", etc.).
      - Every date must be a specific year, and for BCE use "BC" after the year.
      - Do NOT write "AD" for modern dates. Just write "YYYY".
      - Use "BC" only if the event happened before the common era.
      - The date must always be in one of the formats above.
      - The summary must be written in simple, clear language that a high school student could easily understand.

      Text:"""${text}"""
    `;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const jsonStart = rawText.indexOf('[');
    const jsonEnd = rawText.lastIndexOf(']');

    if (jsonStart === -1 || jsonEnd === -1) {
      console.error('Could not find JSON array in Gemini response');
      return [];
    }

    const jsonText = rawText.slice(jsonStart, jsonEnd + 1);

    try {
      return JSON.parse(jsonText);
    } catch (e) {
      console.error('Failed to parse JSON from Gemini:', e);
      return [];
    }

  } catch (error) {
    console.error('Gemini parsing error:', error);
    return [];
  }
}

module.exports = { generateTimelineFromGemini };