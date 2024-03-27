import { useState } from 'react';
import RobotSpinner from './Spinner';
import InstaCard from './Card';
import { AI_API_SERVER_URL } from '../constants';

import { AnimatePresence, motion } from 'framer-motion';

const EmptyCard = ({ card, products, INST }) => {
	const [gcard, setgCard] = useState([]);
	const [loading, setLoading] = useState(false);
	const [cardError, setCardError] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState();
	const [saving, isSaving] = useState(false);
	const [isFirstSave, setFirstSave] = useState(true);
	const getRandomCard = () => {
		if (!Array.isArray(products) || products.length === 0) {
			// Handle the case where the array is not valid or empty
			throw new Error('The array is empty or not an array');
		}
		const randomProductIndex = Math.floor(Math.random() * products.length);
		return products[randomProductIndex].node;
	};
	const getCard = async () => {
		setCardError(false);
		setLoading(true);
		try {
			const product = getRandomCard();
			setSelectedProduct(product);
			const response = await fetch(AI_API_SERVER_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					product_name: product.title,
					image_url: product.images.edges[0].node.url,
					product_price: product.variants.edges[0].node.price,
					product_description: product.description,
				}),
			});

			if (!response.ok) {
				setLoading(false);
				setCardError(true);
				// This will handle HTTP errors like 500, 404, etc.
				// throw new Error(`Server error: ${response.status}`);
			}

			const data = await response.json();

			if (data.error) {
				setLoading(false);
				setCardError(true);
				// Handle API-specific errors
				// throw new Error(`API error: ${data.error}`);
			}

			// If everything is fine, proceed to set your state
			setLoading(false);
			isSaving(true);
			setgCard([{ gallery: product.images.edges, ...data }]);
		} catch (error) {
			// This will catch both network errors, fetch errors, and your custom errors
			console.error('Fetching error:', error.message);
			// alert(`Error: ${error.message}`);
			setLoading(false);
		}
	};

	return (
		<>
			{typeof gcard !== 'undefined' && gcard.length <= 0 && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{
						opacity: 0,
						y: 20,
						scale: 1.1,
						transition: { duration: 0.2 },
					}}
					transition={{
						delay: 0.2 * card,
						duration: 0.6,
					}}
					className="col-span-1 p-[3px] shadow rounded-lg cursor-pointer duration-300 transition-all hover:scale-105"
					onClick={() => {
						getCard();
					}}
				>
					<div className="bg-white rounded-lg min-h-[200px] flex items-center">
						{!cardError ? (
							<div className="w-full text-center">
								{!loading && (
									<div className="w-full text-center mb-5">
										<img
											src="/img/generate_post.png"
											width="30"
											className="inline-block w-[40px]"
										/>
									</div>
								)}
								{!loading &&
									typeof gcard !== 'undefined' &&
									gcard.length <= 0 && (
										<button className="font-semibold">
											Generate a post for{' '}
											<span className="underline underline-offset-4">
												{card}
											</span>
										</button>
									)}
								{loading && <RobotSpinner />}
							</div>
						) : (
							<div className="w-full p-4 text-center">
								<h3 className="text-xl font-semibold mb-1">Ooops.</h3>
								<p className="mb-1">
									There was an error retrieving the content. Please regenerate
									your post clicking the button below.
								</p>
								<button
									className="font-semibold bg-black text-white px-4 py-2 rounded"
									onClick={() => {
										getCard();
									}}
								>
									Try Again
								</button>
							</div>
						)}
					</div>
				</motion.div>
			)}
			{gcard.length > 0 && typeof gcard !== 'undefined' && (
				<AnimatePresence>
					<InstaCard
						card={gcard[0]}
						label={card}
						regen={getCard}
						loading={loading}
						setgCard={setgCard}
						product={selectedProduct}
						INST={INST}
						saving={saving}
						isSaving={isSaving}
						isFirstSave={isFirstSave}
						setFirstSave={setFirstSave}
					/>
				</AnimatePresence>
			)}
		</>
	);
};
export default EmptyCard;
