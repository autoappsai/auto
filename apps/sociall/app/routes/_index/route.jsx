import { json, redirect } from '@remix-run/node';
import { Form, Link, useLoaderData } from '@remix-run/react';
import { login } from '../../shopify.server';
import indexStyles from './style.css';

export const links = () => [{ rel: 'stylesheet', href: indexStyles }];

export const loader = async ({ request }) => {
	const url = new URL(request.url);

	if (url.searchParams.get('shop')) {
		throw redirect(`/app?${url.searchParams.toString()}`);
	}

	return json({ showForm: Boolean(login) });
};

export default function App() {
	const { showForm } = useLoaderData();

	return (
		<div className="index">
			<div className="text-center">
				<h1>You've been disconnected from Sociall</h1>
				<p>To log back in please <Link to="/app" className="underline underline-offset-4">Click Here</Link></p>
			</div>
		</div>
	);
}
