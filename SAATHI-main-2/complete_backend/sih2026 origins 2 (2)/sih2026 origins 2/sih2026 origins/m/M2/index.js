/**
 * M2: Semantic Chunker & Vector Embedder Service (MERN Stack)
 */
class SemanticChunkerEmbedder {
  static chunkText(text = '', maxChunkWords = 150) {
    const words = text.split(/\s+/);
    const chunks = [];
    for (let i = 0; i < words.length; i += maxChunkWords) {
      const chunkText = words.slice(i, i + maxChunkWords).join(' ');
      chunks.push({
        chunkId: `chk_${chunks.length + 1}`,
        text: chunkText,
        wordCount: chunkText.split(/\s+/).length,
        embedding: this.generateEmbedding(chunkText)
      });
    }
    return chunks;
  }

  static generateEmbedding(text = '') {
    // Generate deterministic 128-dimensional normalized pseudo-embedding
    const vector = new Array(128).fill(0);
    for (let i = 0; i < text.length; i++) {
      vector[i % 128] = (vector[i % 128] + text.charCodeAt(i)) % 100 / 100;
    }
    return vector;
  }
}

const chunkText = (t, w) => SemanticChunkerEmbedder.chunkText(t, w);
const generateEmbedding = (t) => SemanticChunkerEmbedder.generateEmbedding(t);

module.exports = { SemanticChunkerEmbedder, chunkText, generateEmbedding };
