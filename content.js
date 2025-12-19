function getVisibleText() {
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                if (!node.parentElement) return NodeFilter.FILTER_REJECT;
                const style = window.getComputedStyle(node.parentElement);
                if (style.display === "none" || style.visibility === "hidden") {
                    return NodeFilter.FILTER_REJECT;
                }
                if (node.textContent.trim().length < 30) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    let text = "";
    let node;
    while ((node = walker.nextNode())) {
        text += node.textContent + " ";
    }

    return text.slice(0, 6000); // limiting
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.type === "EXTRACT_CONTENT") {
        sendResponse({ text: getVisibleText() });
    }
});
