/* KEY */
const OPENAI_API_KEY = "USE_YOUR_OWN_KEY_HERE";

async function analyzeContent(text) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You analyze webpage content and return ONLY valid JSON."
                },
                {
                    role: "user",
                    content: `
                                Analyze the webpage content below.

                                Return ONLY JSON in this format:
                                {
                                "page_type": "",
                                "sentiment": "",
                                "summary": ""
                                }

                                Webpage Content:
                                ${text}
                                `
                }
            ],
            temperature: 0.2
        })
    });

    if (!response.ok) {
        throw new Error("OpenAI API request failed");
    }

    const data = await response.json();

    return JSON.parse(data.choices[0].message.content);
}

/*popup */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "ANALYZE_TEXT") {
        analyzeContent(request.text)
            .then(result => sendResponse(result))
            .catch(error => {
                console.error("AI Error:", error);
                sendResponse({
                    page_type: "Unknown",
                    sentiment: "Neutral",
                    summary: "Unable to analyze page."
                });
            });
        return true; 
    }
});
