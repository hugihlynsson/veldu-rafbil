// Picked on Icelandic performance, not general benchmarks. Oct 2026, with the
// chat's low thinking: 3.7 Flash 63.3, 3.8 Flash 62.3, GPT-6 Luna (high) 57.
// 3.8 is here only because Google deprecated 3.7, which also spent ~30% fewer
// output tokens at the same price. Re-run the comparison before
// changing it, and say here what it found. The reviews on the cars' pages
// are written by it too, as they are the same Icelandic.
// https://huggingface.co/spaces/mideind/icelandic-llm-leaderboard
export const advisorModel = 'gemini-3.8-flash'
