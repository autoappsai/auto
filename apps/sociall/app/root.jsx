import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useRouteError,
} from '@remix-run/react';
import stylesheet from './tailwind.css';
import carouselCSS from 'react-multi-carousel/lib/styles.css';
export function links() {
	return [
		{ rel: 'stylesheet', href: stylesheet },
		{ rel: 'stylesheet', href: carouselCSS },
	];
}
export default function App() {
	return (
		<html>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<Outlet />
				<LiveReload />
				<Scripts />
				<ScrollRestoration />
			</body>
		</html>
	);
}
// export function ErrorBoundary() {
// 	const error = useRouteError();
// 	console.error(error);
// 	return (
// 		<html>
// 			<head>
// 				<title>Oh no!</title>
// 				<Meta />
// 				<Links />
// 			</head>
// 			<body>
// 				<h1>Oops! We have an issue.</h1>
// 				<Scripts />
// 			</body>
// 		</html>
// 	);
// }
