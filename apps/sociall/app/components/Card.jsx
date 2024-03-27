import { Spinner } from '@shopify/polaris';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import RobotSpinner from './Spinner';
import Carousel from 'react-multi-carousel';
import Saver from './Saver';
import { createPost } from '../dao';
import { authenticate } from '../shopify.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { AI_API_SERVER_URL } from '../constants';

export const loader = async ({ request }) => {
	await authenticate.admin(request);

	return json({
		JWT_TOKEN: process.env.JWT_TOKEN,
	});
};

const InstaCard = ({
	card,
	label,
	regen,
	loading,
	setgCard,
	product,
	saving,
	isSaving,
	INST,
	isFirstSave,
	setFirstSave,
}) => {
	const [content, setContent] = useState(card.post_description);
	const [isEditable, setIsEditable] = useState(false);
	const [isManual, setIsManual] = useState(false);
	const [disable, setDisable] = useState(false);
	const [updatingText, setUpdatingText] = useState(false); //status
	const [triggerPostCreation, setTriggerPostCreation] = useState(false); //actual trigger
	const [cardError, setCardError] = useState(false);
	const [postID, setPostID] = useState(1);
	const [publishTime, setPublishTime] = useState('');
	const [saveError, setSaveError] = useState();
	// Handle double click to make div editable
	const handleDoubleClick = (e) => {
		e.stopPropagation(); // Prevent event from propagating further
		e.preventDefault(); // Prevent any default action
		setIsEditable(true);
	};

	const loaderData = useLoaderData();

	const hasSaved = useRef(false);

	useEffect(() => {
		if (isFirstSave && !hasSaved.current) {
			console.log('Attempting first save');
			hasSaved.current = true;
			handlePostCreation();
			// Remember to set hasSaved.current back to false if you ever need to reset this logic
		} else {
			isSaving(false);
		}
	}, [isFirstSave]);

	useEffect(() => {
		if (triggerPostCreation) {
			// Make sure you have the latest state here
			handlePostCreation(postID);
			// Reset the trigger to avoid repeated calls
			setTriggerPostCreation(false);
		}
	}, [triggerPostCreation, postID]);

	useEffect(() => {
		handlePostCreation(postID);
		setTriggerPostCreation(false); // Call a method that triggers the saving operation.
	}, [card]);

	const responsive = {
		superLargeDesktop: {
			// the naming can be any, depends on you.
			breakpoint: { max: 4000, min: 3000 },
			items: 1,
		},
		desktop: {
			breakpoint: { max: 3000, min: 1024 },
			items: 1,
		},
		tablet: {
			breakpoint: { max: 1024, min: 464 },
			items: 1,
		},
		mobile: {
			breakpoint: { max: 464, min: 0 },
			items: 1,
		},
	};

	const regenText = async () => {
		setUpdatingText(true);
		try {
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
				setCardError(true);
				setUpdatingText(false);
			}

			const data = await response.json();
			setUpdatingText(false);

			if (data.error) {
				setCardError(true);
				setUpdatingText(false);
			}
			setgCard([{ gallery: card.gallery, ...data }]);

			setTriggerPostCreation(true);
		} catch (error) {
			setCardError(true);
			setUpdatingText(false);
			console.error('Fetching error:', error.message);
		}
	};

	const handleBlur = () => {
		setIsEditable(false);
		setIsManual(true);
		setTriggerPostCreation(postID);
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			e.target.blur();
			setIsManual(true);
			setTriggerPostCreation(postID);
		}
	};

	async function handlePostCreation(postID) {
		isSaving(true);

		const postObj = {
			id: postID && postID,
			gallery: JSON.stringify(card.gallery),
			text: isManual ? content : card.post_description,
			hashtags: card.post_hashtags,
			imageUrl: card.image_url,
			postDate: '2024-02-25T00:00:00.000Z',
			timeOfDay: publishTime !== '' ? publishTime : '',
			installations_SocialNetworks_id: INST,
		};

		try {
			const response = await createPost(postObj, loaderData.JWT_TOKEN); // Assuming createPost is an Axios call

			setPostID(response.id);
			isSaving(false);
			setFirstSave(false);
			setIsManual(false);
			console.log('Post' + JSON.stringify(response.data));
		} catch (error) {
			if (error.response) {
				console.error(error.response.data);
				isSaving(false);
				setSaveError(true);
				throw {
					statusCode: error.response.status,
					message: error.response.data.message || 'Error',
				};
			} else if (error.request) {
				// The request was made but no response was received
				console.error(error.request);
				isSaving(false);
				setSaveError(true);
				throw {
					statusCode: error.code || 'ERR_NETWORK',
					message: 'Network Error',
				};
			} else {
				// Something happened in setting up the request that triggered an Error
				console.error('Error', error.message);
				isSaving(false);
				setSaveError(true);
				throw {
					message: error.message || 'Error',
				};
			}
		}
	}

	return (
		<motion.div
			id={postID}
			initial={{ opacity: 0, y: -20, scale: 0.9 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, y: 20, scale: 1.1, transition: { duration: 0.2 } }}
			transition={{
				y: { type: 'spring', stiffness: 100 },
				opacity: { duration: 0.2 },
				scale: {
					type: 'spring',
					stiffness: 260,
					damping: 20,
				},
			}}
			className="card col-span-2 p-4 rounded-lg border border-slate-100 bg-white shadow relative"
		>
			{loading && (
				<div className="absolute z-50 flex w-full h-full items-center justify-center -mt-[20px]">
					<RobotSpinner />
				</div>
			)}

			{saving ? (
				<div className="absolute top-5 left-5">
					<Saver />
				</div>
			) : (
				!saveError && (
					<div className="absolute top-5 left-5 text-xs">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							className="w-6 h-6 stroke-green-400 inline-block mr-2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m4.5 12.75 6 6 9-13.5"
							/>
						</svg>
						Post Saved{' '}
						{publishTime === '' ? (
							<span className="text-xs">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="w-5 h-5 inline-block mr-1 ml-4"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
									/>
								</svg>
								Select the time for your publication
							</span>
						) : (
							<span className="py-1 px-2 bg-green-500 rounded inline-block ml-3 text-xs font-bold text-white">
								Ready
							</span>
						)}
					</div>
				)
			)}
			{saveError && (
				<div className="absolute top-5 left-5 text-xs">
					Error Saving Post.{' '}
					<span
						className="underline underline-offset-4"
						onClick={() => handlePostCreation()}
					>
						Click Here
					</span>{' '}
					to try again
				</div>
			)}

			<div
				className={`flex items-start p-4 transition-all duration-300 ${loading && 'opacity-40 saturate-0'}`}
			>
				<div className="w-[350px] h-[400px] relative mr-10">
					<Carousel
						responsive={responsive}
						srr={false}
						containerClass="w-[350px] h-[400px]"
						showDots={true}
						arrows={false}
						draggable={false}
					>
						{card.gallery.map((image, index) => (
							<div className="w-[320px] h-[320px]">
								<img
									src={image.node.url}
									className="mr-8 relative rounded-xl object-fill"
								/>
							</div>
						))}
					</Carousel>
				</div>
				<div>
					<span className="bg-blue-200 py-1 px-3 rounded text-blue-600 text-xs font-semibold absolute top-3 right-3">
						{label}
					</span>
					<div className="w-full h-full relative">
						{updatingText && (
							<div className="absolute w-full flex h-full items-center justify-center">
								<Spinner />
							</div>
						)}

						<div
							className={`content mt-6 max-w-[100%] transition-all duration-200 ${isEditable && 'p-2 border border-slate-300 rounded outline-none'} ${updatingText && 'opacity-20 saturate-50'}`}
							onClick={handleDoubleClick}
							onBlur={handleBlur}
							onKeyDown={handleKeyDown}
							contentEditable={isEditable}
							dangerouslySetInnerHTML={{ __html: card.post_description }}
							// Use this to reflect changes in the content state when editing
							onInput={(e) => setContent(e.currentTarget.innerHTML)}
							suppressContentEditableWarning={true}
						></div>
					</div>
					<div className="block mt-4 p-2 border-slate-100 rounded border">
						<button
							id="regen-text--button"
							className="border-slate-700 border py-1 px-3 hover:text-white hover:bg-slate-700 transition-all duration-300 text-xs font-semibold text-slate-700 rounded inline-block my-2"
							onClick={() => regenText()}
						>
							<svg
								className="inline-block mr-2 stroke-slate-700 hover:stroke-white"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M16.023 9.348H21.015L17.834 6.165C16.8099 5.14087 15.5342 4.40439 14.1352 4.02961C12.7362 3.65482 11.2632 3.65493 9.86428 4.02992C8.46534 4.40492 7.18977 5.14159 6.16581 6.16587C5.14184 7.19015 4.40557 8.46595 4.03101 9.865M2.98501 19.644V14.652M2.98501 14.652H7.97701M2.98501 14.652L6.16501 17.835C7.18912 18.8591 8.4648 19.5956 9.8638 19.9704C11.2628 20.3452 12.7358 20.3451 14.1347 19.9701C15.5337 19.5951 16.8092 18.8584 17.8332 17.8341C18.8572 16.8099 19.5934 15.5341 19.968 14.135M21.015 4.356V9.346"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							Regenerate Text
						</button>{' '}
						<span className="text-slate-700 text-xs inline-block ml-3">
							Or double click to edit content.
						</span>
					</div>
					<div className="hashtags p-5 rounded bg-gradient-to-br from-indigo-100 border-indigo-200 to-pink-50 mt-4 text-xs">
						{card.post_hashtags}
					</div>
				</div>
			</div>
			<div className="actions flex gap-x-4 items-center mt-4 py-4 border-t border-gray-100">
				<div>
					<button
						className="py-2 px-2 inline-block bg-slate-800 transition-all border border-slate-800 duration-200 hover:bg-violet-600 hover:border-violet-600 text-white font-semibold text-xs rounded"
						onClick={() => {
							regen(), setDisable(true);
						}}
					>
						Generate New Post
					</button>
					<button
						className="py-2 px-2 ml-6 border border-slate-800 text-xs font-medium text-slate-800 rounded"
						onClick={() => setgCard([])}
					>
						<svg
							className="inline-block stroke-slate-700 mr-1 align-middle"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M14.74 9.00003L14.394 18M9.606 18L9.26 9.00003M19.228 5.79003C19.57 5.84203 19.91 5.89703 20.25 5.95603M19.228 5.79003L18.16 19.673C18.1164 20.2383 17.8611 20.7662 17.445 21.1513C17.029 21.5364 16.4829 21.7502 15.916 21.75H8.084C7.5171 21.7502 6.97102 21.5364 6.55498 21.1513C6.13894 20.7662 5.88359 20.2383 5.84 19.673L4.772 5.79003M19.228 5.79003C18.0739 5.61555 16.9138 5.48313 15.75 5.39303M4.772 5.79003C4.43 5.84103 4.09 5.89603 3.75 5.95503M4.772 5.79003C5.92613 5.61555 7.08623 5.48313 8.25 5.39303M15.75 5.39303V4.47703C15.75 3.29703 14.84 2.31303 13.66 2.27603C12.5536 2.24067 11.4464 2.24067 10.34 2.27603C9.16 2.31303 8.25 3.29803 8.25 4.47703V5.39303M15.75 5.39303C13.2537 5.20011 10.7463 5.20011 8.25 5.39303"
								stroke="black"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						Delete Post
					</button>
				</div>
				<div className="ml-auto">
					<form className="mr-3 inline-block">
						{publishTime === '' && (
							<span className="bg-red-100 py-1 px-2 rounded text-red-500 text-xs inline-block mr-2">
								Please select the time to publish &rarr;
							</span>
						)}
						<select
							id="tod"
							className="py-2 px-2 w-[180px] border border-gray-200 rounded text-left"
							onChange={(e) => {
								setPublishTime(e.target.value), setTriggerPostCreation(postID);
							}}
						>
							<option disabled selected>
								Time to publish
							</option>
							<option>Morning</option>
							<option>Midday</option>
							<option>Afternoon</option>
							<option>Late Afternoon</option>
							<option>Night</option>
						</select>
					</form>
				</div>
			</div>
		</motion.div>
	);
};

export default InstaCard;
