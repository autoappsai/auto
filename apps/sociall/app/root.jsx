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
				{/* Insert Tawk.to script before closing body tag */}
				<script
					dangerouslySetInnerHTML={{
						__html: `
						var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
						(function(){
						var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
						s1.async=true;
						s1.src='https://embed.tawk.to/66f19b4f4cbc4814f7dd9c93/1i8fsdbn3';
						s1.charset='UTF-8';
						s1.setAttribute('crossorigin','*');
						s0.parentNode.insertBefore(s1,s0);
						})();`,
					}}
				/>
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
