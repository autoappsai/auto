import { useState } from 'react';
import RobotSpinner from './Spinner';
import InstaCard from './InstaCard';
import { AnimatePresence, motion } from 'framer-motion';
import { createPost } from '../dao';
import { useGlobalState } from '../context';

const EmptyCard = ({ label, getCard }) => {
	const [gcard, setgCard] = useState([]);
	const [loading, setLoading] = useState(false);
	const [cardError, setCardError] = useState(false);

	const { state } = useGlobalState();
	function getDayDateInEasternTime(label) {
		const daysOfWeek = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
		];
		const timeZone = 'America/New_York'; // Eastern Time zone

		// Get today's date in Eastern Time
		let today = new Date(
			new Date().toLocaleString('en-US', { timeZone: timeZone })
		);
		const todayDayIndex = today.getDay(); // 0 (Sunday) to 6 (Saturday)
		const labelDayIndex = daysOfWeek.indexOf(label);

		let dayDiff = labelDayIndex - todayDayIndex;
		if (dayDiff < 0) {
			// If the day has already passed in the current week, find it in the next week
			dayDiff += 7;
		}

		// Adjust the date to the next occurrence of the specified day
		today.setDate(today.getDate() + dayDiff);
		today.setHours(0, 0, 0, 0); // Reset time to 00:00:00.000

		// Format the date to 'yyyy-mm-dd 00:00:00.000' in Eastern Time
		const year = today.getFullYear();
		let month = today.getMonth() + 1; // getMonth() is zero-based
		let day = today.getDate();

		month = month.toString().padStart(2, '0');
		day = day.toString().padStart(2, '0');

		// Assuming the server or environment where this runs supports Intl
		const formattedDateString = `${year}-${month}-${day}`;
		const formattedDate = new Date(formattedDateString).toLocaleString(
			'en-US',
			{
				timeZone: timeZone,
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: false,
			}
		);

		// Removing the time part, appending '00:00:00.000' assuming the need is for a consistent format
		const datePart = formattedDate.split(', ')[0];
		return `${datePart} 00:00:00.000`;
	}

	const handleNewCard = async () => {
		setCardError(false);
		setLoading(true);
		const newProd = await getCard();
		if (newProd === 'error') {
			setCardError(true);
		}
		if (newProd) {
			saveNewPost(newProd);
			setLoading(false);
		}
	};

	async function saveNewPost(newProd) {
		const postObj = {
			// TODO, checkear con mato que carajo mando como id para crear el post nuevo, no anda nada.
			gallery: JSON.stringify(newProd[0].gallery),
			text: newProd[0].post_description,
			hashtags: newProd[0].post_hashtags,
			imageUrl: newProd[0].image_url,
			postDate: getDayDateInEasternTime(),
			timeOfDay: '',
		};

		try {
			const response = await createPost(postObj, state.jwtToken); // Assuming createPost is an Axios call
			setgCard(newProd);
		} catch (error) {
			setCardError(true);
			if (error.response) {
				console.error(error.response.data);

				throw {
					statusCode: error.response.status,
					message: error.response.data.message || 'Error',
				};
			} else if (error.request) {
				// The request was made but no response was received
				setCardError(true);
				console.error(error.request);
				throw {
					statusCode: error.code || 'ERR_NETWORK',
					message: 'Network Error',
				};
			} else {
				setCardError(true);
				// Something happened in setting up the request that triggered an Error
				console.error('Error', error.message);
				throw {
					message: error.message || 'Error',
				};
			}
		}
	}

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
						delay: 0.2 * label,
						duration: 0.6,
					}}
					className="col-span-1 p-[3px] shadow rounded-lg cursor-pointer duration-300 transition-all hover:scale-105"
					onClick={() => {
						handleNewCard();
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
											alt=""
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
												{label}
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
										handleNewCard();
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
						label={label}
						regen={getCard}
						setgCard={setgCard}
					/>
				</AnimatePresence>
			)}
		</>
	);
};
export default EmptyCard;
