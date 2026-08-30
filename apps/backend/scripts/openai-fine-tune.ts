import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required');
  }

  const client = new OpenAI({ apiKey });
  const datasetPath = path.resolve(process.cwd(), 'apps/backend/scripts/fine-tune-data.jsonl');

  if (!fs.existsSync(datasetPath)) {
    throw new Error(`Dataset file not found: ${datasetPath}`);
  }

  console.log('Uploading dataset for fine-tuning...', datasetPath);
  const response = await client.files.upload({
    file: fs.createReadStream(datasetPath),
    purpose: 'fine-tune',
  });

  console.log('File uploaded:', response.id);
  console.log('Creating fine-tune job...');

  const job = await client.fineTunes.create({
    training_file: response.id,
    model: 'gpt-4o-mini',
    suffix: 'tamwep-rag-finetune',
  });

  console.log('Fine-tune job created:', job.id);
  console.log('Status:', job.status);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
