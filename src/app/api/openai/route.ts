import { GithubSDKTypes } from "@opensdks/sdk-github";
import { OpenAIStream } from 'ai';
import OpenAI from 'openai';

type Commit = GithubSDKTypes["components"]["schemas"]["commit"];

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export const POST = async (req: Request) => {
  const { commits  } = await req.json()
  const messages = commits.map((commit ) => commit.commit.message).join("\n");
  const prompt = `I have a list of software commit messages and need a summary of the changes. Here are the commit messages:\n${messages}\nCan you provide a summary?`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: messages },
      ],
    });

    const stream = OpenAIStream(response);
    return new Response(stream);
  } catch (err) {
    console.error("Error summarizing commits:", err);
    throw err;
  }
};
