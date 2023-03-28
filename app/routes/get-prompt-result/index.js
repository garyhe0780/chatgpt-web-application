const {Configuration, OpenAIApi} = require("openai");
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = async (req, res) => {
  // Get the prompt from the request body
  const { prompt, model = "gpt" } = req.body;

  // Check if prompt is present in the request
  if (!prompt) {
    // Send a 400 status code and a message indicating that the prompt is missing
    return res.status(400).send({ error: "Prompt is missing in the request" });
  }

  try {
    // Use the OpenAI SDK to create a completion
    // with the given prompt, model and maximum tokens
    if (model === "image") {
      const result = await openai.createImage({
        prompt,
        response_format: "url",
        size: "512x512",
      });
      return res.send(result.data.data[0].url);
    }
    if (model === "chatgpt") {
      const result = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });
      return res.send(result.data.choices[0]?.message?.content);
    }
    const completion = await openai.createCompletion({
      model: model === "gpt" ? "text-davinci-003" : "code-davinci-002", // model name
      prompt: `Please reply below question in markdown format.\n ${prompt}`, // input prompt
      max_tokens: model === "gpt" ? 4000 : 8000, // Use max 8000 tokens for codex model
    });
    // Send the generated text as the response
    return res.send(completion.data.choices[0].text);
  } catch (error) {
    const errorMsg = error.response ? error.response.data.error : `${error}`;
    console.error(errorMsg);
    // Send a 500 status code and the error message as the response
    return res.status(500).send(errorMsg);
  }
};