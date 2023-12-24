import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1";

const configuration = new Configuration({
  apiKey: "OpenAI API Key",
});

const openai = new OpenAIApi(configuration);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const prompt =
      "1. For 'genre', Select one of the following genres: dance, funk, pop, rnb or trap. 2. For 'title', give me a three word title for a drum rhythm matching the genre you've selected. 3. For 'description', give me a two line rap about your title without including the words of the title. 4. For 'beat_high' 'beat_mid' and 'beat_low', give me a high, mid and low rhythm to match the genre and title. Each is an array of 8 objects, where each object has an 'active' property. The 'active' property value alternates between true and false. 5. For 'bpm' add a custom BPM for this drum rhythm. Return each answer in one json object.";

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });

    const {
      data: {
        choices: [{ message }],
      },
    } = response;
    console.log("open ai response", response);

    return new Response(message?.content, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("Error in function:", error);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});

