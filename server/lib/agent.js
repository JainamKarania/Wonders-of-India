const MAX_STEPS = 4;

// Runs the model, executes any tool calls it makes, feeds the results back, and
// repeats until the model answers in plain text. It has no database or SDK
// imports so it can be tested with fakes.
export async function runAgent({ generate, contents, config, runTool, maxSteps = MAX_STEPS }) {
  const conversation = [...contents];

  for (let step = 0; step < maxSteps; step += 1) {
    const response = await generate({ contents: conversation, config });
    const calls = response.functionCalls ?? [];

    if (calls.length === 0) {
      return { text: response.text ?? "", finished: true };
    }

    // The model's own turn is appended untouched. Newer Gemini models attach a
    // "thought signature" to it that must be sent back on the next call.
    const modelTurn = response.candidates?.[0]?.content;
    conversation.push(
      modelTurn ?? { role: "model", parts: calls.map((call) => ({ functionCall: call })) }
    );

    const parts = [];
    for (const call of calls) {
      const result = await runTool(call.name, call.args ?? {});
      parts.push({
        functionResponse: {
          name: call.name,
          ...(call.id ? { id: call.id } : {}),
          response: result,
        },
      });
    }

    conversation.push({ role: "user", parts });
  }

  return { text: "", finished: false };
}