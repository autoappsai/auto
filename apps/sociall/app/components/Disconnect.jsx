import { initTokenFlow } from '../dao';
const Disconnect = ({ token, dispatch }) => {
	async function logout(token) {
		initTokenFlow(token);
		dispatch({ type: 'SET_FACEBOOK_TOKEN_EXISTS', payload: false });
	}
	return <span onClick={() => logout(token)}>Disconnect</span>;
};
export default Disconnect;
