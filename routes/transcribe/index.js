const fs = require("fs");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = async (req, res) => {
  try {
    const resp = await openai.createTranscription(
      fs.createReadStream(req.file.path),
      "whisper-1",
      "text"
    );
    return res.send(resp.data.text);
  } catch (error) {
    const errorMsg = error.response ? error.response.data.error : `${error}`;
    console.log(errorMsg);
    return res.status(500).send(errorMsg);
  } finally {
    fs.unlinkSync(req.file.path);
  }
};
