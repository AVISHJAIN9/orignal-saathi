function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * A chunk source takes the text to reveal and yields it incrementally.
 * `fakeTypingStream` simulates this locally; a real implementation (e.g. one
 * reading Server-Sent Events from a backend) can satisfy the same signature
 * and be swapped in without changing anything that consumes it.
 */
export type TextChunkSource = (text: string) => AsyncGenerator<string>;

export const instantText: TextChunkSource = async function* (text) {
  yield text;
};

export const fakeTypingStream: TextChunkSource = async function* (text) {
  const words = text.split(" ");
  const totalDurationMs = 1300;
  const delayPerWordMs = totalDurationMs / words.length;

  for (let i = 0; i < words.length; i++) {
    yield i === 0 ? words[i] : ` ${words[i]}`;
    await sleep(delayPerWordMs);
  }
};
