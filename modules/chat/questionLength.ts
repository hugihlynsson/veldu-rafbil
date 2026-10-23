// Apart from the message schema so the chat bar can read it: the bar loads on
// every visit, and zod and the AI SDK wait until someone uses the chat.
// The input stops typing here and the route refuses past it, so a question is
// never the thing that makes a request expensive.
export const MAX_QUESTION_LENGTH = 2_000
