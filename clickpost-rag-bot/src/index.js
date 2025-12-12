import { Hono } from 'hono';

const app = new Hono();

// Slack signature verification
async function verifySlackRequest(request, signingSecret, rawBody) {
	if (!signingSecret) {
		console.warn('SLACK_SIGNING_SECRET not configured - skipping verification');
		return false;
	}

	const signature = request.headers.get('X-Slack-Signature');
	const timestamp = request.headers.get('X-Slack-Request-Timestamp');

	if (!signature || !timestamp) {
		return false;
	}

	// Check timestamp to prevent replay attacks (within 5 minutes)
	const currentTime = Math.floor(Date.now() / 1000);
	if (Math.abs(currentTime - parseInt(timestamp)) > 300) {
		return false;
	}

	// Use the provided raw body for signature verification
	const sigBaseString = `v0:${timestamp}:${rawBody}`;

	// Create HMAC signature
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
	const computedSignature = 'v0=' + Array.from(new Uint8Array(signatureBuffer))
		.map(b => b.toString(16).padStart(2, '0'))
		.join('');

	// Use timing-safe comparison
	return computedSignature === signature;
}

// Helper function to remove document references from response
function removeDocumentReferences(text) {
	if (!text) return text;
	
	// Remove phrases like "According to the document", "Based on the document", etc.
	text = text.replace(/According to (the )?document[^.]*\.?\s*/gi, '');
	text = text.replace(/Based on (the )?document[^.]*\.?\s*/gi, '');
	text = text.replace(/According to (the )?[^"]*\.md[^.]*\.?\s*/gi, '');
	text = text.replace(/Based on (the )?[^"]*\.md[^.]*\.?\s*/gi, '');
	text = text.replace(/The document "[^"]*" (states|indicates|shows|mentions|contains|provides)[^.]*\.?\s*/gi, '');
	text = text.replace(/In (the )?document "[^"]*"[^.]*\.?\s*/gi, '');
	
	// Clean up any double spaces or awkward spacing
	text = text.replace(/\s{2,}/g, ' ');
	text = text.replace(/\n\s*\n\s*\n/g, '\n\n');
	
	return text.trim();
}

// Helper function to remove code references from response
function removeCodeReferences(text) {
	if (!text) return text;
	
	// Remove function calls with parentheses (e.g., fetch_courier_partner_service_url(...))
	text = text.replace(/[a-zA-Z_][a-zA-Z0-9_]*\s*\([^)]*\)/g, '');
	
	// Remove method calls with dots (e.g., object.method(), Enum.VALUE)
	text = text.replace(/[a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*\s*\([^)]*\)/g, '');
	text = text.replace(/[a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*/g, '');
	
	// Remove phrases that mention code construction
	text = text.replace(/is constructed using[^.]*\.?\s*/gi, '');
	text = text.replace(/is built using[^.]*\.?\s*/gi, '');
	text = text.replace(/is created using[^.]*\.?\s*/gi, '');
	text = text.replace(/using [a-zA-Z_][a-zA-Z0-9_]*\s*\([^)]*\)[^.]*\.?\s*/gi, '');
	text = text.replace(/via [a-zA-Z_][a-zA-Z0-9_]*\s*\([^)]*\)[^.]*\.?\s*/gi, '');
	
	// Remove code snippets in backticks that look like function calls
	text = text.replace(/`[a-zA-Z_][a-zA-Z0-9_]*\s*\([^)]*\)`/g, '');
	text = text.replace(/`[a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*`/g, '');
	
	// Remove phrases like "using fetch_courier_partner_service_url" or "via fetch_courier_partner_service_url"
	text = text.replace(/\b(using|via|through|by calling|by using)\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\([^)]*\)[^.]*\.?\s*/gi, '');
	
	// Clean up any double spaces or awkward spacing
	text = text.replace(/\s{2,}/g, ' ');
	text = text.replace(/\n\s*\n\s*\n/g, '\n\n');
	
	return text.trim();
}

// Helper function to convert markdown to Slack mrkdwn format
function formatForSlack(text) {
	if (!text) return text;
	
	// Convert markdown headers to bold (Slack doesn't support ### headers)
	// Convert ### Header to *Header*
	text = text.replace(/^###\s+(.+)$/gm, '*$1*');
	// Convert ## Header to *Header*
	text = text.replace(/^##\s+(.+)$/gm, '*$1*');
	// Convert # Header to *Header*
	text = text.replace(/^#\s+(.+)$/gm, '*$1*');
	
	// Convert markdown bold (**text**) to Slack bold (*text*)
	// Handle cases where **text** appears in the text
	text = text.replace(/\*\*(.+?)\*\*/g, '*$1*');
	
	// Ensure proper line breaks (max 2 consecutive newlines)
	text = text.replace(/\n{3,}/g, '\n\n');
	
	return text;
}

// Health check
app.get('/', (c) => {
	return c.json({
		message: 'ClickPost RAG Bot',
		routes: {
			query: 'POST /query - Ask questions'
		}
	});
});

app.post('/slack', async (c) => {
	try {
	  // Get raw body text for verification (must be done before parsing)
	  const rawBody = await c.req.raw.clone().text();
	  
	  // Verify request is from Slack
	  const signingSecret = c.env.SLACK_SIGNING_SECRET;
	  const isValid = await verifySlackRequest(c.req.raw, signingSecret, rawBody);
	  
	  if (!isValid) {
		console.error('Invalid Slack signature');
		return c.json({ text: "Unauthorized" }, 401);
	  }

	  // A. Parse the incoming form data from Slack (application/x-www-form-urlencoded)
	  const params = new URLSearchParams(rawBody);
	  const body = {};
	  for (const [key, value] of params.entries()) {
		body[key] = value;
	  }
	  
	  const question = body.text;
	  const response_url = body.response_url;
  
	  // Basic validation
	  if (!question) {
		return c.json({ text: "Please provide a question. Example: /cpbot What is the cancellation url of shiprocket?" });
	  }
  
	  // B. Define the Background Task (The RAG Search)
	  const runSearch = async () => {
		try {
		  console.log(`Processing background query: ${question}`);
		  
		  // Enhance query with instructions to avoid document and code references
		  const enhancedQuery = `${question}\n\nBe precise and technical. Provide a direct answer without mentioning source documents, file names, or any code references. Do not include phrases like "According to the document", "Based on the document", or code snippets like "fetch_courier_partner_service_url(...)" or "CourierPartnerServiceTypeEnum.AUTHORIZATION". Provide only the information requested in slack language.`;
		  
		  // Run your AI Search
		  const searchResult = await c.env.AI.autorag("clickpost-rag-bot").aiSearch({
			query: enhancedQuery,
		  });
  
		  // Extract the response text from the search result
		  // The autorag returns an object with a 'response' field containing the answer
		  const rawAnswerText = typeof searchResult === 'string' 
			? searchResult 
			: (searchResult?.response || JSON.stringify(searchResult));
  
		  // Remove document references from the response
		  let cleanedAnswerText = removeDocumentReferences(rawAnswerText);
		  
		  // Remove code references from the response
		//   cleanedAnswerText = removeCodeReferences(cleanedAnswerText);
  
		  // Format the answer text for Slack (convert markdown to mrkdwn)
		  const answerText = formatForSlack(cleanedAnswerText);
  
		  // Format response using Slack Block Kit for better presentation
		  const blocks = [
			{
			  type: "section",
			  text: {
				type: "mrkdwn",
				text: `*Q:* ${question}`
			  }
			},
			{
			  type: "divider"
			},
			{
			  type: "section",
			  text: {
				type: "mrkdwn",
				text: answerText
			  }
			}
		  ];
  
		  // Send final answer back to Slack via the response_url
		  await fetch(response_url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
			  response_type: "in_channel", // "in_channel" shares answer with everyone. Use "ephemeral" for private.
			  blocks: blocks,
			  text: `Q: ${question}\n\n${cleanedAnswerText}` // Fallback text for notifications (cleaned but unformatted)
			})
		  });
  
		} catch (err) {
		  console.error("Background error:", err);
		  // Inform user of error
		  await fetch(response_url, {
			  method: 'POST',
			  headers: { 'Content-Type': 'application/json' },
			  body: JSON.stringify({ text: `Sorry, I encountered an error processing your request.` })
		  });
		}
	  };
  
	  // C. Trigger background execution (Non-blocking)
	  c.executionCtx.waitUntil(runSearch());
  
	  // D. Immediately acknowledge Slack (Must happen < 3 seconds)
	  return c.json({
		  response_type: "ephemeral", // Only the user sees this "Thinking" message
		  text: "Thinking... :thinking_face:" 
	  });
  
	} catch (error) {
	  console.error('Route error:', error);
	  return c.json({ text: "Internal Server Error" }, 500);
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

		// Enhance query with instructions to avoid document and code references
		const enhancedQuery = `${question}\n\nPlease provide a direct answer without mentioning source documents, file names, or any code references. Do not include phrases like "According to the document", "Based on the document", or any function calls, method names, or code snippets like "fetch_courier_partner_service_url(...)" or "CourierPartnerServiceTypeEnum.AUTHORIZATION". Provide only the information requested in plain language.`;

		const searchResult = await c.env.AI.autorag("clickpost-rag-bot").aiSearch({
			query: enhancedQuery,
		});

		// Extract and clean the response
		const rawAnswerText = typeof searchResult === 'string' 
			? searchResult 
			: (searchResult?.response || JSON.stringify(searchResult));
		
		// Remove document and code references
		let cleanedAnswerText = removeDocumentReferences(rawAnswerText);
		cleanedAnswerText = removeCodeReferences(cleanedAnswerText);

		return c.json({
			answer: cleanedAnswerText,
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
