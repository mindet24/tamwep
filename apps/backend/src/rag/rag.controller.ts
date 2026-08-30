import { Body, Controller, Get, Post } from '@nestjs/common';
import { RagService } from './rag.service';

@Controller('rag')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Post('ingest')
  async ingest(@Body() body: { title: string; content: string }) {
    return this.ragService.ingestDocument(body.title, body.content);
  }

  @Get('status')
  status() {
    return { count: this.ragService['documents'].length };
  }

  @Post('query')
  async query(@Body() body: { query: string }) {
    return this.ragService.queryWithRag(body.query);
  }
}
