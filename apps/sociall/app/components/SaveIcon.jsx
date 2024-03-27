import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedSaveIcon = () => {
	const [isSaved, setIsSaved] = useState(false);

	const variants = {
		initial: { opacity: 0, scale: 0 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0 },
	};

	return (
		<div
			style={{ position: 'relative', width: '20px', height: '20px' }}
			onClick={() => setIsSaved(!isSaved)}
		>
			{!isSaved && (
				<motion.svg
					key="floppy"
					initial="initial"
					animate="animate"
					exit="exit"
					variants={variants}
					transition={{ duration: 0.5 }}
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					style={{ position: 'absolute' }}
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M4 2C3.44772 2 3 2.44772 3 3V21C3 21.5523 3.44772 22 4 22H20C20.5523 22 21 21.5523 21 21V3C21 2.44772 20.5523 2 20 2H4ZM19 20H5V4H8V7H16V4H19V20Z"
						fill="currentColor"
					/>
				</motion.svg>
			)}
			{isSaved && (
				<motion.svg
					key="checkmark"
					initial="initial"
					animate="animate"
					exit="exit"
					variants={variants}
					transition={{ duration: 0.5 }}
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					style={{ position: 'absolute' }}
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M20.7071 5.29289C21.0976 5.68342 21.0976 6.31658 20.7071 6.70711L10.7071 16.7071C10.3166 17.0976 9.68342 17.0976 9.29289 16.7071L3.29289 10.7071C2.90237 10.3166 2.90237 9.68342 3.29289 9.29289C3.68342 8.90237 4.31658 8.90237 4.70711 9.29289L10 14.5858L19.2929 5.29289C19.6834 4.90237 20.3166 4.90237 20.7071 5.29289Z"
						fill="currentColor"
					/>
				</motion.svg>
			)}
		</div>
	);
};

export default AnimatedSaveIcon;
