import { Spinner } from '@shopify/polaris';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import RobotSpinner from './Spinner';
import Carousel from 'react-multi-carousel';
import Saver from './Saver';
import { createPost } from '../dao';
import { AI_API_SERVER_URL } from '../constants';
import { useGlobalState } from '../context';

const InstaCard = ({ card, label, regen, setgCard }) => {
	// const [content, setContent] = useState(card.post_description);
	const [isEditable, setIsEditable] = useState(false);
	const [saving, isSaving] = useState(false);
	const [cardError, setCardError] = useState(false); //TODO card regen error
	const [disable, setDisable] = useState(false);
	const [updatingText, setUpdatingText] = useState(false); //status
	const [postID, setPostID] = useState(card.id); //keep the initial id in case of the regerate post to insted of deleting and creating we directly update with the same id
	const [regenTextError, setTextRegenError] = useState(false); //TODO text regen error
	const [publishTime, setPublishTime] = useState(card.timeOfDay);
	const [saveError, setSaveError] = useState();
	const [loading, setLoading] = useState(false);

	// Handle double click to make div editable
	const handleDoubleClick = (e) => {
		e.stopPropagation(); // Prevent event from propagating further
		e.preventDefault(); // Prevent any default action
		setIsEditable(true);
	};

	const { state } = useGlobalState();

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

	const handleProductRegen = async () => {
		setLoading(true);
		const newProd = await regen();
		if (newProd) {
			console.log(newProd);
			card.post_description = newProd[0].post_description;
			card.post_hashtags = newProd[0].post_hashtags;
			card.imageUrl = newProd[0].image_url;

			setLoading(false);
		}
		setDisable(false);
		updatePost(publishTime);
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
					product_name: 'The Archived Snowboard', //TODO: Replace by Database data
					image_url: card.imageUrl ? card.imageUrl : card.image_url, //Todo, normalize this names
					product_price: '979.99', //TODO: Replace by Database data
					product_description: card.post_description,
				}),
			});

			if (!response.ok) {
				setSaveError(true);
				setUpdatingText(false);
			}

			const data = await response.json();
			setUpdatingText(false);

			card.post_description = data.post_description;

			updatePost(publishTime);

			if (data.error) {
				setCardError(true);
				setUpdatingText(false);
			}
		} catch (error) {
			setCardError(true);
			setUpdatingText(false);
			console.error('Fetching error:', error.message);
		}
	};

	const handleBlur = () => {
		setIsEditable(false);
		updatePost(publishTime);
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			e.target.blur();
		}
	};

	async function updatePost(publishTime) {
		setSaveError(false);
		isSaving(true);
		const postObj = {
			id: card.id,
			gallery: JSON.stringify(card.gallery),
			text: card.post_description,
			hashtags: card.post_hashtags,
			imageUrl: card.imageUrl ? card.imageUrl : card.image_url,
			postDate: card.postDate,
			timeOfDay: publishTime ? publishTime : '',
		};

		try {
			const response = await createPost(postObj, state.jwtToken); // Assuming createPost is an Axios call

			setPostID(response.id);
			isSaving(false);
			// setFirstSave(false);
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
			className="card col-span-2 mb-10 lg:mb-0 p-4 rounded-lg border border-slate-100 bg-white shadow relative"
		>
			{loading && (
				<div className="absolute z-50 flex w-full h-full items-center justify-center -mt-[20px]">
					<RobotSpinner />
				</div>
			)}

			{saving ? (
				<div className="absolute lg:top-5 top-12 left-5">
					<Saver />
				</div>
			) : !saveError && !publishTime && !saveError ? (
				<div className="absolute lg:top-5 top-12 left-5 text-xs w-full lg:w-auto text-center lg:text-left">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="w-6 h-6 stroke-green-400 inline-block mr-2"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m4.5 12.75 6 6 9-13.5"
						/>
					</svg>
					Post Saved
					{publishTime && (
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
					)}
				</div>
			) : (
				!saveError && (
					<div className="absolute lg:top-5 top-12 left-5 text-xs w-full lg:w-auto text-center lg:text-left md:-ml-8 -ml-6 lg:-ml-0">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
							className="w-6 h-6 stroke-green-400 inline-block mr-2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m4.5 12.75 6 6 9-13.5"
							/>
						</svg>
						Post Scheduled for {label} at {publishTime}
					</div>
				)
			)}
			{saveError && (
				<div className="absolute lg:top-5 left-5 text-xs z-30 top-12">
					Error Saving Post.{' '}
					<span
						className="underline underline-offset-4 cursor-pointer"
						onClick={() => updatePost()}
					>
						Click Here
					</span>{' '}
					to try again
				</div>
			)}

			<div
				className={`lg:flex lg:items-start  p-4 transition-all duration-300 ${loading && 'opacity-40 saturate-0'}`}
			>
				<div className="lg:w-[350px] w-full lg:h-[400px] h-[350px] relative lg:mr-10 lg:mt-5 mt-12 z-0">
					{card.gallery && card.gallery > 0 ? (
						<Carousel
							responsive={responsive}
							srr={false}
							containerClass="w-[350px] h-[400px]"
							showDots={true}
							arrows={false}
							draggable={false}
						>
							{card.gallery.map((image, index) => (
								<div className="w-[320px] h-[320px]" key={index}>
									<img
										alt=""
										src={image.node.url}
										className="mr-8 relative rounded-xl object-fill"
									/>
								</div>
							))}
						</Carousel>
					) : (
						<AnimatePresence>
							<motion.div
								initial={{ opacity: 0, y: -20, scale: 0.9 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								key={card.imageUrl}
								exit={{
									opacity: 0,
									y: 20,
									scale: 1.1,
									transition: { duration: 0.2 },
								}}
								transition={{
									y: { type: 'spring', stiffness: 100 },
									opacity: { duration: 0.3 },
									scale: {
										type: 'spring',
										stiffness: 260,
										damping: 20,
									},
								}}
								className="lg:w-[350px] w-full lg:h-[400px] h-[350px] mt-3 overflow-hidden flex items-start justify-center"
							>
								<img
									src={card.imageUrl ? card.imageUrl : card.image_url} //TODO: make names match
									alt="tu vieja"
									className="relative rounded-xl max-w-full max-h-full w-auto h-auto"
								/>
							</motion.div>
						</AnimatePresence>
					)}
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
							onInput={(e) =>
								(card.post_description = e.currentTarget.innerHTML)
							}
							suppressContentEditableWarning={true}
						></div>
					</div>
					<div className="block mt-4 p-2 border-slate-100 rounded border text-center lg:text-left">
						<button
							id="regen-text--button"
							disabled={disable}
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
			<div className="actions lg:flex gap-x-4 lg:items-center mt-4 py-4 border-t border-gray-100">
				<div className="flex-1 w-full">
					<button
						className="py-2 px-2 w-full lg:w-auto inline-block bg-slate-800 transition-all border border-slate-800 duration-200 hover:bg-violet-600 hover:border-violet-600 text-white font-semibold text-xs rounded"
						disabled={disable}
						onClick={() => {
							handleProductRegen(), setDisable(true);
						}}
					>
						Generate New Post
					</button>
					<button
						className="py-2 lg:px-2 w-full lg:w-auto mt-4 lg:mt-0 lg:ml-6 border border-slate-800 text-xs font-medium text-slate-800 rounded"
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
				<div className="ml-auto w-full lg:w-auto mt-4 lg:mt-0">
					<form className="mr-3 inline-block lg:w-[180px] w-full">
						{!publishTime && (
							<span className="bg-red-100 py-1 px-2 rounded text-red-500 text-xs inline-block mr-2">
								Please select the time to publish &rarr;
							</span>
						)}
						<select
							id="tod"
							className="py-2 px-2 lg:w-[180px] w-full border border-gray-200 rounded text-left"
							value={publishTime ? publishTime : 'default'}
							onChange={(e) => {
								const newPublishTime = e.target.value;
								setPublishTime(newPublishTime);
								updatePost(newPublishTime); // Pass the new publishTime directly
							}}
						>
							<option value="default" disabled>
								Time to publish
							</option>
							<option value="Morning">Morning</option>
							<option value="Midday">Midday</option>
							<option value="Afternoon">Afternoon</option>
							<option value="Late Afternoon">Late Afternoon</option>
							<option value="Night">Night</option>
						</select>
					</form>
				</div>
			</div>
		</motion.div>
	);
};

export default InstaCard;
