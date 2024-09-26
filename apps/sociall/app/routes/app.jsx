import { json } from '@remix-run/node';
import { Link, Outlet, useLoaderData, useRouteError } from '@remix-run/react';
import polarisStyles from '@shopify/polaris/build/esm/styles.css';
import { boundary } from '@shopify/shopify-app-remix/server';
import { AppProvider } from '@shopify/shopify-app-remix/react';
import { authenticate } from '../shopify.server';
import { useGlobalState, GlobalStateProvider } from '../context';
import { useEffect } from 'react';
import { getSession, appInit, login } from '../dao';
export const links = () => [{ rel: 'stylesheet', href: polarisStyles }];

export const loader = async ({ request }) => {
	await authenticate.admin(request);
	const { searchParams } = new URL(request.url);
	const shop = searchParams.get('shop');

	const session = await getSession(shop);
	console.log('session :>> ', session);

	console.log('Init Info :>> ', {
		shop,
		accessToken: session.accessToken,
		shopifyAppUrl: process.env.SHOPIFY_APP_URL,
		shopifyApiKey: process.env.SHOPIFY_API_KEY,
		shopifyApiSecret: process.env.SHOPIFY_API_SECRET,
	});

	const initResponse = await appInit({
		shop,
		accessToken: session.accessToken,
		shopifyAppUrl: process.env.SHOPIFY_APP_URL,
		shopifyApiKey: process.env.SHOPIFY_API_KEY,
		shopifyApiSecret: process.env.SHOPIFY_API_SECRET,
	});

	const { token } = await login({
		username: shop,
		password: session.accessToken,
	});

	return json({
		apiKey: process.env.SHOPIFY_API_KEY || '',
		jwtToken: token,
		facebookTokenExists:
			initResponse.token !== null && initResponse.token !== 'Pending',
	});
};

function InitializeStore() {
	const { dispatch } = useGlobalState();
	const { jwtToken, facebookTokenExists } = useLoaderData();

	useEffect(() => {
		dispatch({ type: 'SET_JWT_TOKEN', payload: jwtToken });
		dispatch({
			type: 'SET_FACEBOOK_TOKEN_EXISTS',
			payload: facebookTokenExists,
		});
	}, [dispatch]);

	return null; // This component doesn't need to render anything
}

export default function App() {
	const { apiKey } = useLoaderData();

	return (
		<AppProvider isEmbeddedApp apiKey={apiKey}>
			<GlobalStateProvider>
				<InitializeStore />
				<ui-nav-menu>
					<a href={'/app/settings'}>Settings</a>
					<a href={'/app/help'}>Help</a>
				</ui-nav-menu>
				<Outlet />
			</GlobalStateProvider>
		</AppProvider>
	);
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
	return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
	return boundary.headers(headersArgs);
};
