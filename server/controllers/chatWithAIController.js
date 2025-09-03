const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const chatWithAI = async (req, res) => {
  try{
    const {message, chatHistory, userAstrologyData} = req.body;

    const astrologyContext = userAstrologyData ? `
    User's Birth Details:
    - Date of Birth: ${userAstrologyData?.birthDetails?.["Date of Birth"] || "N/A"}
    - Time of Birth: ${userAstrologyData.personalInfo?.birthDetails?.["Birth Time"] || "N/A"}
    - Place of Birth: ${userAstrologyData.personalInfo?.birthDetails?.["Birth Place"] || "N/A"}
    - Nakshatra: ${userAstrologyData.personalInfo?.birthDetails?.Nakshtra || "N/A"}
    - Gana: ${userAstrologyData.personalInfo?.birthDetails?.Gana || "N/A"}
    - Planetary Position:${userAstrologyData.planetaryPositions?.map(planet => 
        `${planet.planet}: ${planet.degreeSign} in House ${planet.house}, ${planet.nakshatra}`
    ).join('\n') || "N/A"}` : "";

    const systemPrompt = `You are Vedic Vedang.AI, an expert vedic astrologer with deep knowledge of Hindu vedic astrology, planetary influences, nakshatras, and spiritual guidance.
    
    ${astrologyContext}

    Guidelines:
    - Provide personalized insights based on the user's birth chart  
    data above.
    - Use Vedic astrology principles and terminology.
    - Be compassionate, wise, and spiritually insightful.
    - Offer practical remedies when appropriate.
    - Keep responses concise but meaningful.
    - Reference specific planetary positions or nakshatras when relevant.
    - Always maintain a mystical yet grounded tone.`;

    const messages = [
      {role:"system", content: systemPrompt},
      ...chatHistory.map(msg =>({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content
      })),
      {role: "user", content: message}
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 500,
      temperature: 0.7
    })
    return res.status(200).json({success: true, response: completion.choices[0].message.content});
  }catch(err){
    //console.log('Cannot chat with AI:', err);
   return res.status(500).json({success: false, message: 'Internal Server Error', error: err.message});
  }
};

module.exports = { chatWithAI };