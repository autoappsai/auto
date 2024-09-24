import { json } from '@remix-run/node';
import { getWeekPosts } from '../dao';
import { validateRequest } from '../jwt';
import { CORS_HTTP_PARAMS } from '../constants';

export const loader = async ({ request }) => {
	if (request.method === `OPTIONS`) {
		return json('', CORS_HTTP_PARAMS);
	}

	return json({ error: 'Invalid request method' }, { status: 405 });
};

export const action = async ({ request }) => {
	switch (request.method) {
		case 'POST': {
			const username = await validateRequest(
				request,
				process.env.JWT_SECRET_KEY
			);
			if (username === null) {
				return json({ error: 'Missing or invalid token' }, { status: 401 });
			}

			console.log('username :>> ', username);

			const post = await getWeekPosts(username, 'Instagram'); // TODO: Replace hardcode Instagram id.
			return json(post, CORS_HTTP_PARAMS);
		}
	}
};
