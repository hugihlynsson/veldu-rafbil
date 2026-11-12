// Picked on Icelandic performance, not general benchmarks. Oct 2026, with the
// chat's low thinking: 3.7 Flash 63.3, 3.8 Flash 62.3, GPT-6 Luna (high) 57.
// Nov 2026, 4 Hydrogen on launch day, before the leaderboard had scored it: on
// ten advisor questions at low thinking its Icelandic read as well as 3.8's,
// but it thought ~2–3x as long, so its first word came ~1.5 s later (median
// ~3.9 s against ~2.4 s) though it finished sooner. Same price as 3.8 from
// Jan 2027. Re-run the comparison before changing it, and say here what it
// found. The reviews on the cars' pages are written by it too, as they are the
// same Icelandic.
// https://huggingface.co/spaces/mideind/icelandic-llm-leaderboard
export const advisorModel = 'gemini-4-hydrogen'
