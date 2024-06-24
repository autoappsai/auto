import axios from 'axios';
import {
	FACEBOOK_API_URL,
	FACEBOOK_CLIENT_ID,
	FACEBOOK_CLIENT_SECRET,
} from './constants';

export async function instagramPublish(imageUrl, caption, accessToken) {
	const instagramBusinessAccount = await getInstagramBusinessAccount(
		accessToken
	);
	const creationId = await createMediaContainer(
		instagramBusinessAccount,
		imageUrl,
		caption,
		accessToken
	);
	const publicationId = await mediaPublish(
		instagramBusinessAccount,
		creationId,
		accessToken
	);
	return publicationId ?? null;
}

export async function me(accessToken) {
	const { data } = await axios.get(FACEBOOK_API_URL + '/me/accounts', {
		params: {
			fields: 'id,name,access_token,instagram_business_account',
			access_token: accessToken,
		},
	});
	return data.data[0] ?? null;
}

export async function getInstagramBusinessAccount(accessToken) {
	const data = await me(accessToken);
	return data.instagram_business_account.id ?? null;
}

export async function createMediaContainer(
	instagramBusinessAccount,
	imageUrl,
	aCaption,
	accessToken
) {
	const { data } = await axios.post(
		FACEBOOK_API_URL + '/' + instagramBusinessAccount + '/media',
		null,
		{
			params: {
				image_url: imageUrl,
				caption: aCaption,
				access_token: accessToken,
			},
		}
	);

	return data.id ?? null;
}

export async function mediaPublish(
	instagramBusinessAccount,
	creationId,
	accessToken
) {
	const { data } = await axios.post(
		FACEBOOK_API_URL + '/' + instagramBusinessAccount + '/media_publish',
		null,
		{
			params: {
				creation_id: creationId,
				access_token: accessToken,
			},
		}
	);

	return data.id ?? null;
}

export async function getLongLivedToken(accessToken) {
	const { data } = await axios.get(FACEBOOK_API_URL + '/oauth/access_token', {
		params: {
			grant_type: 'fb_exchange_token',
			client_id: FACEBOOK_CLIENT_ID,
			client_secret: FACEBOOK_CLIENT_SECRET,
			fb_exchange_token: accessToken,
		},
	});

	return data.access_token;
}
