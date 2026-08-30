import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

interface StoredDocument {
  id: string;
  title: string;
  content: string;
  embedding: number[];
}

@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);
  private readonly openai: OpenAI;
  private readonly documents: StoredDocument[] = [];

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.openai = new OpenAI({ apiKey });
  }

  async ingestDocument(title: string, content: string) {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: content,
    });

    const embedding = response.data[0].embedding;
    const document: StoredDocument = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      title,
      content,
      embedding,
    };
    this.documents.push(document);
    this.logger.log(`Ingested document ${document.id}`);
    return document;
  }

  private cosineSimilarity(a: number[], b: number[]) {
    const dot = a.reduce((sum, value, index) => sum + value * b[index], 0);
    const magA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
    const magB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));
    return dot / (magA * magB);
  }

  async queryWithRag(userQuery: string) {
    if (!this.documents.length) {
      return { query: userQuery, answer: 'No documents have been ingested yet.' };
    }

    const embeddingResponse = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: userQuery,
    });
    const queryEmbedding = embeddingResponse.data[0].embedding;

    const ranked = this.documents
      .map((doc) => ({
        doc,
        score: this.cosineSimilarity(queryEmbedding, doc.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const contextText = ranked.map((item) => `Title: ${item.doc.title}\nContent: ${item.doc.content}`).join('\n\n');
    const prompt = `Use the following context to answer the user query. If the answer is not contained in the context, say you don't know exactly, but provide a helpful response.\n\nContext:\n${contextText}\n\nQuery:\n${userQuery}`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: 'You are a helpful RAG assistant.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500,
    });

    const answer = completion.choices[0]?.message?.content?.trim() ?? 'Unable to generate an answer.';
    return {
      query: userQuery,
      answer,
      retrieved: ranked.map((item) => ({ id: item.doc.id, title: item.doc.title, score: item.score })),
    };
  }
}
