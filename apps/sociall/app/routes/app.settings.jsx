import { Image, Page, Spinner } from '@shopify/polaris';
import Disconnect from '../components/Disconnect';
import { useGlobalState } from '../context';
import { useEffect, useState } from 'react';
import { me } from '../dao';

export default function Settings() {
	const { state, dispatch } = useGlobalState();
	const [fbdata, setFbData] = useState(null);
	useEffect(() => {
		if (!state.jwtToken) return; // Ensure jwtToken exists before running the effect

		const fetchData = async () => {
			try {
				const meFb = await me(state.jwtToken);
				console.log(meFb);
				setFbData(meFb);
			} catch (error) {
				console.error('Error fetching Facebook data:', error);
			}
		};

		fetchData();
	}, [state.jwtToken]); // Only runs when jwtToken changes and is non-null

	return (
		<Page>
			<div className="bg-white w-full shadow-md rounded-xl text-text-primary font-primaryFont mb-16">
				<div className="p-12 flex justify-between items-center w-full">
					<img src="/img/logo_sociall.jpg" width="180" alt="autosociall" />
				</div>
				<div className="content container mx-auto px-12 pt-5 pb-20 mb-10">
					<h1 className="text-xl block">Active Connections</h1>
					<hr className="my-6" />
					{state.facebookTokenExists ? (
						fbdata !== null ? (
							<div className="p-4 border border-gray-100 shadow-md shadow-purple-50 rounded flex items-center justify-between">
								<div className="flex items-center">
									<div className="inline-block mr-3 self-start relative">
										<Image src="/img/instagram.png" width={30} height="auto" />
										<div className="w-3 h-3 block rounded-full bg-green-500 border border-green-600 absolute -top-1 -left-1 z-50"></div>
									</div>
									<div className="inline-block">
										<div className="text-sm block mb-1 font-semibold">
											<span className="block mb-2">
												Connected to {fbdata.name}'s Instagram
											</span>
											<pre className="font-normal text-xs">
												ID: {fbdata.id}{' '}
												<span className="py-1 px-2 border border-slate-200 rounded text-xs">
													Business
												</span>
											</pre>
										</div>
									</div>
								</div>
								<div>
									<Disconnect
										token={state.jwtToken}
										dispatch={dispatch}
										fb={fbdata}
									/>
								</div>
							</div>
						) : (
							<div className='w-6 h-6'>
							<Spinner size="small"/>
							</div>
						)
					) : (
						<p>No connections</p>
					)}
				</div>
			</div>
			<div className="text-center mb-20">
				<small className="text-sm text-slate-700">&copy;2024 Auto</small>
			</div>
		</Page>
	);
}
