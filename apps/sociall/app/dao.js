import axios from 'axios';
import { SOCIALL_API_SERVER_URL } from './constants';
import prisma from './db.server';

// SHOPIFY API ----

export async function getStoreProducts(admin) {
	const query = `
          {
            products(first: 100) {
              edges {
                node {
                  id
                  title
                  description
                  images(first: 3) {
                    edges {
                      node {
                        url
                      }
                    }
                  }
                  variants(first: 1) {
                    edges {
                      node {
                        price
                        sku
                      }
                    }
                  }
                }
              }
            }
          }
    `;

	const response = await admin.graphql(query);
	const response_json = await response.json();
	return response_json.data.products.edges;
}

// SOCIALL API ----

let authHeader;

export async function setJwtToken(token) {
	authHeader = {
		headers: {
			Authorization: 'Bearer ' + token,
		},
	};
}

export async function initTokenFlow(jwtToken) {
	setJwtToken(jwtToken);
	const response = await axios.post(
		SOCIALL_API_SERVER_URL + '/init-token-flow',
		null,
		authHeader
	);
	return response.data;
}

export async function weekPosts(jwtToken) {
	setJwtToken(jwtToken);
	const response = await axios.post(
		SOCIALL_API_SERVER_URL + '/week-posts',
		null,
		authHeader
	);
	return response.data;
}

export async function upsertPost(post, jwtToken) {
	setJwtToken(jwtToken);
	const response = await axios.post(
		SOCIALL_API_SERVER_URL + '/post',
		post,
		authHeader
	);
	return response.data;
}

export async function deletePost(id, jwtToken) {
	setJwtToken(jwtToken);
	const response = await axios.delete(SOCIALL_API_SERVER_URL + '/post', {
		headers: {
			Authorization: 'Bearer ' + jwtToken,
		},
		data: { id: id },
	});
	return response.data;
}

export async function appInit(params) {
	const response = await axios.post(
		SOCIALL_API_SERVER_URL + '/app-init',
		params
	);
	return response.data;
}

export async function login(params) {
	const response = await axios.post(SOCIALL_API_SERVER_URL + '/login', params);
	return response.data;
}

export async function me(jwtToken) {
	setJwtToken(jwtToken);
	const response = await axios.post(
		SOCIALL_API_SERVER_URL + '/me',
		null,
		authHeader
	);
	return response.data;
}

// LOCAL ----

export async function getSession(shop) {
	const session = await prisma.session.findFirst({
		where: {
			shop: shop,
		},
	});

	return session;
}
