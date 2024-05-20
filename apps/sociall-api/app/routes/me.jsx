import { json } from '@remix-run/node';
import { getPosts } from '../dao';
import { validateRequest } from '../jwt';
import { CORS_HTTP_PARAMS } from '../constants';
import { getInstallations_SocialNetworks } from '../dao';
import { me } from '../fb';

export const loader = async ({ request }) => {
	if (request.method === `OPTIONS`) {
		return json('', CORS_HTTP_PARAMS);
	}

	return json({ error: 'Invalid request method' }, { status: 405 });
};

export const action = async ({ request }) => {
	switch (request.method) {
		case 'POST': {
			// Protect Endpoint.
			const username = validateRequest(request, process.env.JWT_SECRET_KEY);
			if (username === null) {
				return json({ error: 'Missing or invalid token' }, { status: 401 });
			}

			const { token } = await getInstallations_SocialNetworks(
				username,
				'Instagram'
			);

			const meFb = await me(token);
			return json(meFb, CORS_HTTP_PARAMS);
		}
	}
};
