import { GoogleGenAI } from "@google/genai";
import { GenerationParams } from "../types";

const SYSTEM_INSTRUCTION = `
You are a professional AI Copywriting & Content Generator assistant. Your role is to create high-quality, engaging, and conversion-focused content across multiple formats.

INSTRUCTIONS:
1. Generate content based on the user's specified topic, content type, and requirements
2. Adapt tone and style according to user preferences
3. Ensure all content is original, SEO-friendly (where applicable), and ready to publish
4. Keep formatting clean and professional
5. Include relevant keywords naturally for blog posts and articles

CONTENT TYPES YOU CAN GENERATE:
- Blog Posts: Informative, well-structured articles (300-2000 words)
- Social Media Posts: Engaging captions for Instagram, Twitter, LinkedIn, Facebook
- Ad Copy: Persuasive, conversion-focused ads (headlines + body)
- Email Newsletters: Professional marketing emails with subject lines
- Product Descriptions: Detailed, benefit-focused product write-ups
- Landing Page Copy: Headlines, subheadings, CTAs
- Video Scripts: Engaging scripts for YouTube, TikTok, Reels
- Sales Pages: High-converting sales copy with testimonial sections

OUTPUT FORMAT:
- Always provide clean, ready-to-use content
- Use markdown formatting for readability
- Include a brief note about key selling points or angles used
- For social media: Include relevant hashtags and emojis where appropriate
- For blog posts: Include a suggested title, intro, body, and conclusion
`;

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const generateTopicSuggestions = async (currentTopic: string): Promise<string[]> => {
  if (!currentTopic.trim()) return [];
  
  const prompt = `
  You are a professional content strategist. The user is brainstorming a topic: "${currentTopic}".
  
  Generate 4 engaging, high-potential variations or specific angles for this topic. 
  They should be catchy titles or clear subject lines that are ready to use.
  
  Return ONLY the 4 variations as a plain text list, separated by newlines. Do not use numbers or bullets.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    const text = response.text || "";
    // Filter and clean the response
    return text.split('\n')
      .map(line => line.replace(/^[-*•\d\s.]+/, '').trim())
      .filter(line => line.length > 5 && !line.toLowerCase().startsWith('here are'));
  } catch (error) {
    console.error("Suggestion API Error:", error);
    return [];
  }
};

export const generateCopy = async (params: GenerationParams): Promise<string> => {
  const prompt = `
Topic: ${params.topic}
Content Type: ${params.contentType}
Target Audience: ${params.audience}
Tone: ${params.tone}
Word Count/Length: ${params.wordCount}
Special Requirements: ${params.specialRequirements}

Based on all the above specifications, generate the content now. Make it engaging, professional, and ready to publish immediately.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Slightly creative but controlled
      },
    });

    return response.text || "No content generated. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate content. Please check your inputs and try again.");
  }
};