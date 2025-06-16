import { AZURE_TRANSLATOR_KEY, AZURE_TRANSLATOR_REGION, AZURE_TRANSLATOR_ENDPOINT } from "@env";

export async function suggestKoreanTranslation(text: string): Promise<string | null> {
    try {
        const res = await fetch(
            `${AZURE_TRANSLATOR_ENDPOINT}?api-version=3.0&from=fr&to=ko`,
            {
                method: "POST",
                headers: {
                    "Ocp-Apim-Subscription-Key": AZURE_TRANSLATOR_KEY,
                    "Ocp-Apim-Subscription-Region": AZURE_TRANSLATOR_REGION,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify([{ Text: text }]),
            }
        );

        const json = await res.json();
        return json[0]?.translations?.[0]?.text ?? null;
    } catch (err) {
        console.warn("Translation error:", err);
        return null;
    }
}