import translateApi from "@vitalets/google-translate-api";

export async function translateToEnglish(text) {

  try {

    if (!text) return "";

    const result = await translateApi(text, {
      to: "en",
      forceBatch: true
    });

    return result.text;

  } catch (error) {

    console.error("Translation error:", error);
    return text;

  }

}