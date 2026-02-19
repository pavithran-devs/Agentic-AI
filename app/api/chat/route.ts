import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';
import { tools } from './tools';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // ✅ Developer Agent Context
  const context = `
You are a Senior Software Developer AI Agent.

You help users with:
- Python development
- Machine Learning
- Web development (Frontend & Backend)
- API building
- Debugging and optimization
- Database design
- System architecture planning

You can explain in both Tamil and English when needed.
Always prioritize clean, production-level code.
  `;

  // ✅ System Prompt (Behavior + Rules)
  const systemPrompt = `
You are an expert Senior Software Engineer.

Process:
1. Understand the problem clearly.
2. Break it into steps.
3. Design the solution.
4. Then write clean, complete, production-ready code.
5. Explain briefly.

Rules:
- Never write incomplete code.
- Follow best practices.
- Handle edge cases.
- Avoid unnecessary complexity.
- Use comments in code.
- If multiple solutions exist, choose the best one and explain why.
- Ask clarification only if necessary.
- Respond in Tamil or English based on user preference.

Tone:
Professional, structured, engineering-focused.
  `;

  const result = streamText({
    model: google('gemini-2.5-flash'),

    // ✅ Combine Context + System Prompt
    system: context + "\n\n" + systemPrompt,

    messages: await convertToModelMessages(messages),

    // ✅ Optional: Enable Tool Calling
    // tools,
    // maxSteps: 5,
  });

  return result.toUIMessageStreamResponse();
}
