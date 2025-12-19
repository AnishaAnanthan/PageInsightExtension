document.getElementById("analyzeBtn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            { type: "EXTRACT_CONTENT" },
            response => {
                if (!response || !response.text) {
                    alert("Unable to extract content");
                    return;
                }

                chrome.runtime.sendMessage(
                    { type: "ANALYZE_TEXT", text: response.text },
                    result => {
                        document.getElementById("type").textContent = result.page_type;
                        document.getElementById("sentiment").textContent = result.sentiment;
                        document.getElementById("summary").textContent = result.summary;
                    }
                );
            }
        );
    });
});
