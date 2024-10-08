import { json } from '@remix-run/node';
import { upsertPost, deletePost } from '../dao';
import { validateRequest } from '../jwt';
import { CORS_HTTP_PARAMS } from '../constants';

export const loader = async ({ request }) => {
	if (request.method === `OPTIONS`) {
		return json('', CORS_HTTP_PARAMS);
	}

	return json({ error: 'Invalid request method' }, { status: 405 });
};

export const action = async ({ request }) => {
	// Protect Endpoint.
	const username = await validateRequest(request, process.env.JWT_SECRET_KEY);
	if (username === null) {
		return json({ error: 'Missing or invalid token' }, { status: 401 });
	}

	console.log('POST USERNAME :>> ', username);

	switch (request.method) {
		case 'POST': {
			const body = await request.json();
			const post = await upsertPost(body, username, 'Instagram');
			return json(post, CORS_HTTP_PARAMS);
		}
		case 'DELETE': {
			const body = await request.json();
			const post = await deletePost(body.id);
			return json(post, CORS_HTTP_PARAMS);
		}
	}
};
