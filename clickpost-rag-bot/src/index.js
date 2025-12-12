import { Hono } from 'hono';

const app = new Hono();

// Health check
app.get('/', (c) => {
	return c.json({
		message: 'ClickPost RAG Bot',
		routes: {
			ingest: 'POST /ingest - Upload and embed chunks',
			query: 'POST /query - Ask questions'
		}
	});
});

// INGESTION ROUTE
app.post('/ingest', async (c) => {
	try {
		const chunks = await c.req.json();

		console.log(`Starting ingestion of ${chunks.length} chunks...`);

		const batchSize = 10;
		let totalInserted = 0;

		for (let i = 0; i < chunks.length; i += batchSize) {
			const batch = chunks.slice(i, i + batchSize);

			// Generate embeddings
			const embeddingPromises = batch.map(async (chunk) => {
				const response = await c.env.AI.run('@cf/baai/bge-small-en-v1.5', {
					text: chunk.text
				});
				return response.data[0];
			});

			const embeddings = await Promise.all(embeddingPromises);

			// Prepare vectors
			const vectors = batch.map((chunk, idx) => ({
				id: `chunk-${i + idx}`,
				values: embeddings[idx],
				metadata: {
					text: chunk.text.substring(0, 2000),
					endpoint: chunk.metadata.endpoint,
					method: chunk.metadata.method,
					path: chunk.metadata.path,
					api: chunk.metadata.api,
					summary: chunk.metadata.summary
				}
			}));

			// Insert into Vectorize
			await c.env.VECTORIZE.upsert(vectors);
			totalInserted += vectors.length;

			console.log(`Batch ${Math.floor(i / batchSize) + 1}: Inserted ${vectors.length} vectors (total: ${totalInserted})`);
		}

		return c.json({
			success: true,
			message: `Successfully ingested ${totalInserted} chunks`,
			total: totalInserted
		});

	} catch (error) {
		console.error('Ingestion error:', error);
		return c.json({
			success: false,
			error: error.message
		}, 500);
	}
});

// QUERY ROUTE
app.post('/query', async (c) => {
	try {
		const { question } = await c.req.json();

		if (!question) {
			return c.json({ error: 'Missing question field' }, 400);
		}

		console.log(`Query: ${question}`);

		// Generate embedding for question
		const questionEmbedding = await c.env.AI.run('@cf/baai/bge-small-en-v1.5', {
			text: question
		});

		// Search Vectorize
		const results = await c.env.VECTORIZE.query(questionEmbedding.data[0], {
			topK: 3,
			returnMetadata: true
		});

		console.log(`Found ${results.matches.length} relevant chunks`);

		if (results.matches.length === 0) {
			return c.json({
				answer: "I couldn't find relevant information in the documentation. Please rephrase your question.",
				sources: []
			});
		}

		// Build context
		const context = results.matches
			.map((match, idx) => {
				return `[Source ${idx + 1} - ${match.metadata.endpoint}]\n${match.metadata.text}\n`;
			})
			.join('\n---\n\n');

		// Generate answer with LLM
		const instructions = `You are a helpful assistant for ClickPost API integration. Answer questions based ONLY on the provided documentation context. If the answer isn't in the context, say so. Be concise and technical.`;

		const input = `Context from documentation:\n\n${context}\n\nQuestion: ${question}\n\nAnswer:`;

		const llmResponse = await c.env.AI.run('@cf/openai/gpt-oss-20b', {
			instructions: instructions,
			input: input
		});

		// Extract sources
		const sources = results.matches.map((match) => ({
			endpoint: match.metadata.endpoint,
			summary: match.metadata.summary,
			score: match.score
		}));

		return c.json({
			answer: llmResponse.response || llmResponse,
			sources: sources,
			question: question
		});

	} catch (error) {
		console.error('Query error:', error);
		return c.json({
			error: error.message
		}, 500);
	}
});

export default app;
