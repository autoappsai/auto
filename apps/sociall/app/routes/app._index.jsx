import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Page } from '@shopify/polaris';
import EmptyCard from '../components/EmptyCard';
import { authenticate } from '../shopify.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useGlobalState } from '../context';
import { initTokenFlow, getStoreProducts, weekPosts } from '../dao';
import { FACEBOOK_DIALOG_URL, AI_API_SERVER_URL } from '../constants';
import InstaCard from '../components/InstaCard';

export const loader = async ({ request }) => {
	// load initial required stuff
	const { admin } = await authenticate.admin(request);
	const products = await getStoreProducts(admin);
	const url = new URL(request.url);
	const queryParams = url.searchParams.toString();
	const wCards = await weekPosts(process.env.JWT_TOKEN);
	return json({
		products: products,
		queryParams: queryParams,
		jwtTokenEnv: process.env.JWT_TOKEN,
		wCards: wCards,
	});
};

export default function Index() {
	const { state, dispatch } = useGlobalState();

	const loaderData = useLoaderData();
	// define the posts loaded from the db
	const [dbPosts, setDbPosts] = useState([]);
	const [gcard, setgCard] = useState([]);
	const [saving, isSaving] = useState(false);

	const weekdays = 6;

	const { products } = useLoaderData();

	useEffect(() => {
		// call database to get the stored posts
		async function getWeekPosts() {
			const posts = await weekPosts(loaderData.jwtTokenEnv); // TODO: the idea was to use state.jwtToken for the FE, but is not there at init.
			setDbPosts(posts);
			console.log(posts);
		}
		getWeekPosts();
	}, []);

	// Get today's date
	const today = new Date();

	// initialize the labels
	const dayLabels = [];

	// fill the array with the labels
	for (let i = 0; i <= weekdays; i++) {
		const nextDay = new Date(today);
		nextDay.setDate(today.getDate() + i);
		// Use timeZone option to ensure the date is treated as being in the US Eastern Time zone
		dayLabels.push(
			nextDay.toLocaleString('en-US', {
				timeZone: 'America/New_York',
				weekday: 'long',
			})
		);
	}
	// select a random card from the products array
	const getRandomCard = () => {
		if (!Array.isArray(products) || products.length === 0) {
			// Handle the case where the array is not valid or empty
			throw new Error('The array is empty or not an array');
		}
		const randomProductIndex = Math.floor(Math.random() * products.length);
		return products[randomProductIndex].node;
	};

	const getCard = async () => {
		// Call to AI generation
		try {
			const product = getRandomCard();
			const response = await fetch(AI_API_SERVER_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					product_name: product.title,
					image_url: product.images.edges[0].node.url, //TODO get the selected Image
					product_price: product.variants.edges[0].node.price,
					product_description: product.description,
				}),
			});

			if (!response.ok) {
				return 'error';
			}

			const data = await response.json();

			// setgCard([{ gallery: product.images.edges, ...data }]);

			return [{ gallery: product.images.edges, ...data }];
		} catch (error) {
			// This will catch both network errors, fetch errors, and your custom errors
			console.error('Fetching error:', error.message);
			// alert(`Error: ${error.message}`);
		}
	};

	const regen = async () => {
		const regenProduct = await getCard();
		console.log(regenProduct);
		return regenProduct;
	};

	async function authFB() {
		// Facebook authentication popup
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
					<img src="/img/logo_sociall.jpg" width="120" alt="autosociall" />
				</div>

				<div className="content">
					{/* if statement to verify that there is a token on facebook side */}
					{state.facebookTokenExists ? (
						<>
							<div className="cards lg:grid lg:grid-cols-2 gap-8 bg-gray-100 p-12">
								<div className="lg:col-span-2 mb-10 lg:mb-0">
									<h1 className="text-2xl font-bold">
										Manage Your Weekly Schedule
									</h1>
									<p className="text-sm mt-3">
										Generated posts will be automatically published on Instagram
										based on the day and time of the day you have defined.
									</p>
								</div>
								{/* check if there are db stored posts by matching the labels */}
								{dbPosts.length > 0 &&
									dayLabels.map((label, index) => {
										const matchingEntry = dbPosts.find((entry) => {
											const isMatch = entry.day === label;
											return isMatch;
										});

										return (
											<AnimatePresence key={index}>
												{matchingEntry && matchingEntry.post ? (
													<InstaCard
														label={label}
														card={matchingEntry.post}
														regen={regen}
														setgCard={setgCard}
													/>
												) : (
													<EmptyCard
														key={label}
														label={label}
														getCard={getCard}
													/>
												)}
											</AnimatePresence>
										);
									})}
							</div>
						</>
					) : (
						// Login Screen if no token
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
										<img src="/img/connection_arrows.png" width="41" alt="" />
									</div>
									<div>
										<img src="/img/auto_connection.png" width="81" alt="" />
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
