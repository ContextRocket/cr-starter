import type {
  A2AEvent,
  A2ATaskParams,
} from "@/lib/a2a-client";

const CANNED_RESPONSE = `This is a simulated response. Because no **ContextRocket A2A endpoint** (\`NEXT_PUBLIC_CR_AGENT_URL\`) is configured, the chat operates in an offline showcase mode.

You can configure the agent by:
1. Creating a free account at [contextrocket.ai](https://contextrocket.ai).
2. Generating an Org Key.
3. Adding your agent URL to \`.env.local\`.

Enjoy exploring the UI!`;

export async function* mockStreamTask(
  params: A2ATaskParams,
  signal?: AbortSignal,
): AsyncGenerator<A2AEvent> {
  const taskId = "task-" + Math.random().toString(36).slice(2);
  const threadId = params.thread_id || "thread-" + Math.random().toString(36).slice(2);

  // 1. Initial working event
  yield {
    type: "TaskStatusUpdateEvent",
    id: taskId,
    status: { state: "working", timestamp: new Date().toISOString() },
    final: false,
    metadata: { thread_id: threadId },
  };

  await new Promise((r) => setTimeout(r, 600));

  // 2. Stream the tokens
  const words = CANNED_RESPONSE.split(" ");
  let index = 0;
  
  for (let i = 0; i < words.length; i++) {
    if (signal?.aborted) return;
    const isFirst = i === 0;
    const isLast = i === words.length - 1;
    const word = words[i] + (isLast ? "" : " ");
    
    yield {
      type: "TaskArtifactUpdateEvent",
      id: taskId,
      artifact: {
        parts: [{ type: "text", text: word }],
        index,
        append: !isFirst,
        lastChunk: isLast,
      },
      final: false,
      metadata: { thread_id: threadId },
    };
    
    index++;
    // Simulate typing delay
    await new Promise((r) => setTimeout(r, 30 + Math.random() * 40));
  }

  // 3. Completed event
  yield {
    type: "TaskStatusUpdateEvent",
    id: taskId,
    status: {
      state: "completed",
      timestamp: new Date().toISOString(),
      message: {
        role: "agent",
        parts: [{ text: CANNED_RESPONSE }],
      },
    },
    final: true,
    metadata: { thread_id: threadId },
  };
}
