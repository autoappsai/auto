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
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M572N9P2')`,
					}}
				/>
			</head>
			<body>
				<script
					dangerouslySetInnerHTML={{
						__html: `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M572N9P2"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`,
					}}
				/>
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
