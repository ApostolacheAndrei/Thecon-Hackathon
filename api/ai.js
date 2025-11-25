/**
 * Funcție pentru generarea de descrieri creative folosind AI
 * @param {string} description - Descrierea originală a locației
 * @returns {Promise<string>} - Descrierea generată de AI
 */
export async function generateVibe(description) {
  try {
    // Notă: Pentru a folosi acest API, ai nevoie de un API key
    // Poți folosi OpenAI, Gemini sau Claude
    // Aici este un exemplu cu OpenAI (necesită EXPO_PUBLIC_OPENAI_API_KEY în .env)
    
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    
    if (!apiKey) {
      // Fallback: returnează o descriere îmbunătățită manual dacă nu există API key
      return enhanceDescription(description);
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Ești un expert în marketing pentru locații de turism studențesc. Scrie descrieri creative, entuziaste și atractive pentru studenți, în română, păstrând informațiile esențiale dar adăugând un vibe pozitiv și energic.'
          },
          {
            role: 'user',
            content: `Recrează următoarea descriere într-un mod mai creativ și atractiv pentru studenți: ${description}`
          }
        ],
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error('AI API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating vibe:', error);
    // Fallback la descriere îmbunătățită
    return enhanceDescription(description);
  }
}

/**
 * Funcție fallback care îmbunătățește descrierea fără AI
 */
function enhanceDescription(description) {
  const enhancements = [
    '✨ ',
    '🎓 Perfect pentru studenți! ',
    '🌟 ',
    '💫 ',
  ];
  
  const randomEnhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
  const vibeWords = ['vibe-ul', 'atmosfera', 'energia', 'experiența'];
  const randomVibe = vibeWords[Math.floor(Math.random() * vibeWords.length)];
  
  return `${randomEnhancement}${description} ${randomVibe.charAt(0).toUpperCase() + randomVibe.slice(1)} de aici este incredibilă! 🚀`;
}


