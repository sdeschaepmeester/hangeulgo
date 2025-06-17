export async function suggestKoreanTranslation(text: string): Promise<string | null> {
    try {
        const res = await fetch("https://hangeulgoback.deschaepmeester-samantha.workers.dev/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });

        const json = await res.json();
        return json.translation ?? null;
    } catch (err) {
        console.warn("Translation error:", err);
        return null;
    }
}