const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = process.env.AI_API_KEY ? new GoogleGenerativeAI(process.env.AI_API_KEY) : null;

async function getAIAdvice(habitTitle, category, description) {
    if (!genAI) {
        // Fallback mock AI for demonstration if no API key is set
        return {
            text: `(Mock AI Advice) Excellent work logging your "${category}" activity: ${habitTitle}. Consistency is key. Try to do this every day to build a strong habit loop.`,
            sentiment: 'Positive'
        };
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are a Growth and Discipline AI advisor. The user just logged a habit.
        Category: ${category}
        Title: ${habitTitle}
        Description: ${description || 'No description provided'}
        
        Provide short, encouraging advice (2-3 sentences) on how to maintain this habit and improve discipline. 
        Also determine the sentiment of this habit (e.g., Positive, Neutral).
        Return a JSON object with 'text' (the advice) and 'sentiment' (the sentiment string).`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Extract JSON from response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            return data;
        } else {
            return { text: responseText, sentiment: 'Neutral' };
        }
    } catch (error) {
        console.error("AI Service Error:", error);
        return { text: "Keep up the good work! (AI Service Unavailable)", sentiment: "Neutral" };
    }
}

module.exports = { getAIAdvice };
