const API_URL = import.meta.env.VITE_API_URL as string; // http://localhost:8080

export async function fetchAvailability(dateISO: string) {
    if (!API_URL) {
        throw new Error("API_URL not configured");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 segundos timeout

    try {
        const response = await fetch(`${API_URL}/availability?date=${dateISO}`, {
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}
