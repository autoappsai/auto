import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Page } from '@shopify/polaris';
import EmptyCard from '../components/EmptyCard';
import { authenticate } from '../shopify.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useGlobalState } from '../context';
import { initTokenFlow, getStoreProducts } from '../dao';
import { FACEBOOK_DIALOG_URL } from '../constants';
import { useNavigate } from 'react-router-dom';

export const loader = async ({ request }) => {
	const { admin } = await authenticate.admin(request);
	const products = await getStoreProducts(admin);
	const url = new URL(request.url);
	const queryParams = url.searchParams.toString();

	return json({
		products: products,
		queryParams: queryParams,
	});
};

export default function Index() {
	const navigate = useNavigate();

	const { state, dispatch } = useGlobalState();

	const loaderData = useLoaderData();

	const [loading, setLoading] = useState(false);

	const weekdays = 6; // You want to generate labels for 6 more days after "Today"

	const { products } = useLoaderData();

	// Get today's date
	const today = new Date();

	const dayLabels = ['Today'];

	const tomorrow = new Date(today);
	tomorrow.setDate(today.getDate() + 1);
	dayLabels.push('Tomorrow');

	for (let i = 2; i <= weekdays; i++) {
		const nextDay = new Date(today);
		nextDay.setDate(today.getDate() + i);
		dayLabels.push(nextDay.toLocaleString('en-US', { weekday: 'long' }));
	}

	async function authFB() {
		console.log('loaderData ' + loaderData.queryParams);
		initTokenFlow(state.jwtToken);

		var width = 600;
		var height = 400;

		var left = screen.width / 2 - width / 2;
		var top = screen.height / 2 - height / 2;

		var features =
			'width=' + width + ',height=' + height + ',top=' + top + ',left=' + left;

		var fbWindow = window.open(FACEBOOK_DIALOG_URL, 'fbLogin', features);

		if (fbWindow) {
			fbWindow.focus();

			// TODO: Negrada, habria que detectar la ventana emergente cerrada por un evento, pero no anda.
			if (fbWindow) {
				var checkClosed = setInterval(function () {
					if (fbWindow.closed) {
						clearInterval(checkClosed);
						fbWindow = null;
						//window.location.reload();1
						//navigate(`/app?${loaderData.queryParams}`);
						dispatch({ type: 'SET_FACEBOOK_TOKEN_EXISTS', payload: true });
					}
				}, 500);
			}
		}
	}
	return (
		<Page>
			<div className="bg-white w-full shadow-md rounded-xl text-text-primary font-primaryFont mb-16">
				<div className="p-12 flex justify-between items-center w-full">
					<img src="/img/logo_sociall.jpg" width="180" alt="autosociall" />
				</div>

				<div className="content">
					{state.facebookTokenExists ? (
						<>
							<div className="cards lg:grid lg:grid-cols-2 gap-8 bg-gray-100 p-12">
								<div className="lg:col-span-2">
									<h1 className="text-2xl font-bold">
										Manage Your Weekly Schedule
									</h1>
									<p className="text-sm mt-3">
										Generated posts will be automatically published based on the
										day and time of the day you defined. Days without generated
										posts will not post to your Instagram account.
									</p>
								</div>
								{dayLabels.map((label, index) => (
									<AnimatePresence>
										<EmptyCard card={label} products={products} />
									</AnimatePresence>
								))}
							</div>
						</>
					) : (
						<div className="insta-connect w-full relative grid grid-cols-12">
							<div className="lg:col-span-10 lg:col-start-2 text-center p-12 rounded mb-12">
								<h1 className="text-text-primary text-2xl font-semibold mb-4">
									Connect to Instagram
								</h1>
								<p className="font-regular text-text-primary text-base">
									We must connect to your Intagram account to start generating
									your posts.
								</p>
								<div className="conection-block-instagram flex w-full justify-center items-center mt-8">
									<div>
										<img
											src="/img/large_instagram_connect.png"
											width="76"
											height="75"
											alt="instagram icon to connect to your account"
										/>
									</div>
									<div className="mx-5">
										<img src="/img/connection_arrows.png" width="41" />
									</div>
									<div>
										<img src="/img/auto_connection.png" width="81" />
									</div>
								</div>
								<button
									target="_blank"
									onClick={() => authFB()}
									className="py-4 px-10 bg-black text-white text-base font-bold mt-8 rounded"
								>
									Connect Now
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="text-center mb-20">
				<small className="text-sm text-slate-700">&copy;2024 Auto</small>
			</div>
		</Page>
	);
}
