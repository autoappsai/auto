// Dao.js refactor with headerBuilder
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

function headerBuilder(token, id = undefined) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...(id !== undefined && { data: { id } }),
  };
}

export async function initTokenFlow(jwtToken) {
	const authHeader = headerBuilder(jwtToken)
	const response = await axios.post(
		SOCIALL_API_SERVER_URL + '/init-token-flow',
		null,
		authHeader
	);
	return response.data;
}

export async function weekPosts(jwtToken) {
	const authHeader = headerBuilder(jwtToken)
	const response = await axios.post(
		SOCIALL_API_SERVER_URL + '/week-posts',
		null,
		authHeader
	);
	return response.data;
}

export async function upsertPost(post, jwtToken) {
	const authHeader = headerBuilder(jwtToken)
	const response = await axios.post(
		SOCIALL_API_SERVER_URL + '/post',
		post,
		authHeader
	);
	return response.data;
}

export async function deletePost(id, jwtToken) {
	const authHeader = headerBuilder(jwtToken, id)
	const response = await axios.delete(SOCIALL_API_SERVER_URL + '/post', authHeader);
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
	const authHeader = headerBuilder(jwtToken)
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

const handleDisconnect = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://graph.facebook.com/${userId}/permissions`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`, // Add the access token in the header
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Handle success: remove token from your database or state
        console.log('Facebook account disconnected:', data);
        onDisconnectSuccess(); // Call any callback after successful disconnect
      } else {
        throw new Error(data.error.message);
      }
    } catch (err) {
      console.error('Error disconnecting Facebook account:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
