const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Mets ta clé ici ou configure .env
});
const openai = new OpenAIApi(configuration);

async function askChatGPT(prompt, language = "fr") {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `Réponds toujours en "${language}", ton réussite, innovation, succès.` },
        { role: "user", content: prompt }
      ],
      max_tokens: 250
    });
    return completion.data.choices[0].message.content;
  } catch (err) {
    return "Je n'ai pas pu consulter ChatGPT, mais la réussite t'attend !";
  }
}

module.exports = { askChatGPT };
