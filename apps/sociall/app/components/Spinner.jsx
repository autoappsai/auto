const RobotSpinner = () => {
	return (
		<div
			role="status"
			className="relative inline-block w-14 h-14 animate-spin rounded-full bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 "
		>
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border-2 border-white"></div>
		</div>
	);
};

export default RobotSpinner;
