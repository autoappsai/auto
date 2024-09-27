import { initTokenFlow } from '../dao';
import { useNavigate } from '@remix-run/react';

const Disconnect = ({ token, dispatch, fb }) => {

	async function logout(token) {
		await initTokenFlow(token);
		dispatch({ type: 'SET_FACEBOOK_TOKEN_EXISTS', payload: false });
	}

	async function disconnectFacebook(fb) {
	  
		try {
		  console.log(`Attempting to disconnect Instagram Business Account ID: ${fb.instagram_business_account.id}`);
		  
		  // Step 1: Get the Facebook App ID
		  const appIdResponse = await fetch(`https://graph.facebook.com/v18.0/app?access_token=${fb.access_token}`);
		  const appData = await appIdResponse.json();
		  const appId = appData.id;
	  
		  console.log(`Facebook App ID: ${appId}`);
	  
		  // Step 2: Attempt to remove the app subscription
		  const unsubscribeUrl = `https://graph.facebook.com/v18.0/${fb.instagram_business_account.id}/subscribed_apps`;
		  console.log(`Making DELETE request to: ${unsubscribeUrl}`);
		  
		  const unsubscribeResponse = await fetch(unsubscribeUrl, {
			method: 'DELETE',
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify({ 
			  access_token: fb.access_token,
			  app_id: appId
			})
		  });
	  
		  const responseData = await unsubscribeResponse.json();
		  console.log('Response from Facebook:', responseData);
	  
		  if (!unsubscribeResponse.ok) {
			throw new Error(`Failed to unsubscribe app: ${unsubscribeResponse.status} ${unsubscribeResponse.statusText}`);
		  }
	  
		  // Step 3: Remove the access token from your database
		  await removeAccessTokenFromDatabase(instagramAccountId);
	  
		  // Step 4: Update your UI
		  updateUIToDisconnectedState();
	  
		  console.log('Disconnection process completed successfully');
		  return true;
		} catch (error) {
		  console.error('Error during Facebook disconnection:', error);
		  updateUIWithErrorMessage(error.message);
		  return false;
		}
	  }


	return (
		<button
			onClick={() => disconnectFacebook(fb)}
			className="py-1 px-3 bg-slate-700 text-white hover:bg-red-500 transition-all duration-300 font-semibold rounded"
		>
			Disconnect
		</button>
	);
};
export default Disconnect;
