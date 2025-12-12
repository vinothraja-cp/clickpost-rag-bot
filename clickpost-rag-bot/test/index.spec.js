import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

// Helper function to generate a valid Slack signature
async function generateSlackSignature(signingSecret, timestamp, rawBody) {
	const sigBaseString = `v0:${timestamp}:${rawBody}`;
	const encoder = new TextEncoder();
	const keyData = encoder.encode(signingSecret);
	const messageData = encoder.encode(sigBaseString);
	
	const cryptoKey = await crypto.subtle.importKey(
		'raw',
		keyData,
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);

	const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
	return 'v0=' + Array.from(new Uint8Array(signatureBuffer))
		.map(b => b.toString(16).padStart(2, '0'))
		.join('');
}

describe('ClickPost RAG Bot', () => {
	describe('Health check', () => {
		it('responds with API info', async () => {
			const request = new Request('http://example.com/');
			const ctx = createExecutionContext();
			const response = await worker.fetch(request, env, ctx);
			await waitOnExecutionContext(ctx);
			const data = await response.json();
			expect(data.message).toBe('ClickPost RAG Bot');
		});
	});

	describe('Slack endpoint - Unauthorized cases', () => {
		const signingSecret = 'test_signing_secret_123';
		const testEnv = { ...env, SLACK_SIGNING_SECRET: signingSecret };
		const rawBody = 'text=test+question&response_url=https://hooks.slack.com/test';
		const currentTimestamp = Math.floor(Date.now() / 1000);

		it('should return 401 when X-Slack-Signature header is missing', async () => {
			const request = new Request('http://example.com/slack', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'X-Slack-Request-Timestamp': currentTimestamp.toString(),
				},
				body: rawBody,
			});

			const ctx = createExecutionContext();
			const response = await worker.fetch(request, testEnv, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(401);
			const data = await response.json();
			expect(data.text).toBe('Unauthorized');
		});

		it('should return 401 when X-Slack-Request-Timestamp header is missing', async () => {
			const request = new Request('http://example.com/slack', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'X-Slack-Signature': 'v0=invalid_signature',
				},
				body: rawBody,
			});

			const ctx = createExecutionContext();
			const response = await worker.fetch(request, testEnv, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(401);
			const data = await response.json();
			expect(data.text).toBe('Unauthorized');
		});

		it('should return 401 when signature is invalid', async () => {
			const request = new Request('http://example.com/slack', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'X-Slack-Signature': 'v0=invalid_signature_12345',
					'X-Slack-Request-Timestamp': currentTimestamp.toString(),
				},
				body: rawBody,
			});

			const ctx = createExecutionContext();
			const response = await worker.fetch(request, testEnv, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(401);
			const data = await response.json();
			expect(data.text).toBe('Unauthorized');
		});

		it('should return 401 when timestamp is too old (> 5 minutes)', async () => {
			const oldTimestamp = currentTimestamp - 301; // 301 seconds = more than 5 minutes
			const invalidSignature = await generateSlackSignature(signingSecret, oldTimestamp.toString(), rawBody);

			const request = new Request('http://example.com/slack', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'X-Slack-Signature': invalidSignature,
					'X-Slack-Request-Timestamp': oldTimestamp.toString(),
				},
				body: rawBody,
			});

			const ctx = createExecutionContext();
			const response = await worker.fetch(request, testEnv, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(401);
			const data = await response.json();
			expect(data.text).toBe('Unauthorized');
		});

		it('should return 401 when timestamp is too far in the future (> 5 minutes)', async () => {
			const futureTimestamp = currentTimestamp + 301; // 301 seconds = more than 5 minutes
			const invalidSignature = await generateSlackSignature(signingSecret, futureTimestamp.toString(), rawBody);

			const request = new Request('http://example.com/slack', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'X-Slack-Signature': invalidSignature,
					'X-Slack-Request-Timestamp': futureTimestamp.toString(),
				},
				body: rawBody,
			});

			const ctx = createExecutionContext();
			const response = await worker.fetch(request, testEnv, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(401);
			const data = await response.json();
			expect(data.text).toBe('Unauthorized');
		});

		it('should return 401 when both headers are missing', async () => {
			const request = new Request('http://example.com/slack', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: rawBody,
			});

			const ctx = createExecutionContext();
			const response = await worker.fetch(request, testEnv, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(401);
			const data = await response.json();
			expect(data.text).toBe('Unauthorized');
		});
	});
});
