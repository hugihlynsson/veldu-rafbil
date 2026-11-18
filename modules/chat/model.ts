// Picked on Icelandic performance, not general benchmarks. Miðeind's
// leaderboard, Nov 2026, at the chat's low thinking: 4 Hydrogen 66.5, 3.7 Flash
// 63.3, 3.8 Flash 62.3; GPT-6.1 Sol's 66.9 costs more. Hydrogen thinks ~2–3x as
// long as 3.8 at low, so in ten paired runs of seven advisor questions its
// first word came ~1.5 s later (median ~3.9 s against ~2.4 s) though it
// finished sooner. From Jan 2027 the two cost the same per token. Re-run the
// comparison before changing it, and say here what it found. The reviews on
// the cars' pages are written by it too, as they are the same Icelandic.
// https://huggingface.co/spaces/mideind/icelandic-llm-leaderboard
export const advisorModel = 'gemini-4-hydrogen'
