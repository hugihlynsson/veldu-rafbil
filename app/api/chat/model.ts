// Picked on Icelandic performance, not general benchmarks. 3.8 is here because
// Google deprecated 3.7, which scored slightly above it on Icelandic and spent
// ~30% fewer output tokens at the same price. Re-run the comparison before
// changing it, and say here what it found. The reviews on the cars' pages
// are written by it too, as they are the same Icelandic.
// https://huggingface.co/spaces/mideind/icelandic-llm-leaderboard
export const advisorModel = 'gemini-3.8-flash'
