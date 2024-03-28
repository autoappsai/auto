import { initTokenFlow } from '../dao';
const Disconnect = ({ token, dispatch }) => {
	async function logout(token) {
		const call = await initTokenFlow(token);
		const response = await call.text();
		if (response === 'Success') {
			dispatch({ type: 'SET_FACEBOOK_TOKEN_EXISTS', payload: false });
		} else {
			alert('la cagaste');
		}
	}
	return <span onClick={() => logout(token)}>Disconnect</span>;
};
export default Disconnect;
