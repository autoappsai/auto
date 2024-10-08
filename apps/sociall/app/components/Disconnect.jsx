import { initTokenFlow } from '../dao';
import { useNavigate } from '@remix-run/react';

const Disconnect = ({ token, dispatch, fb }) => {

	async function logout(token) {
		await initTokenFlow(token);
		dispatch({ type: 'SET_FACEBOOK_TOKEN_EXISTS', payload: false });
	}


	return (
		<button
			onClick={() => logout(token)}
			className="py-1 px-3 bg-slate-700 text-white hover:bg-red-500 transition-all duration-300 font-semibold rounded"
		>
			Disconnect
		</button>
	);
};
export default Disconnect;
