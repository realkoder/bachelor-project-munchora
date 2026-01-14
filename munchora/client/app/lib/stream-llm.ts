

export function streamLlm(prompt: string,) {
    const encodedPrompt = encodeURIComponent(prompt);
    const eventSource = new EventSource(`http://localhost:3000/api/v1/llm/stream?prompt=${encodedPrompt}`);

    eventSource.onmessage = (event) => {
        console.log("New chunk:", event.data);
        // Append chunk to UI here
    };

    eventSource.onerror = (event) => {
        console.log("Stream closed.", eventSource.readyState);
        // console.error("SSE error", event);
        eventSource.close();
    };
}

export async function chatJsonLlm(prompt: string,) {
    try {
        const response = await fetch('http://localhost:3000/api/v1/llm/chat-json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}