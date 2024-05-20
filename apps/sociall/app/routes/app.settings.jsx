import { Image, Page } from '@shopify/polaris';
import Disconnect from '../components/Disconnect';
import { useGlobalState } from '../context';
import { useEffect, useState } from 'react';
import { me } from '../dao';

export default function Settings() {
	const { state, dispatch } = useGlobalState();
	const [instagramName, setInstagramName] = useState(null);

	useEffect(() => {
		async function fetchData() {
			const meFb = await me(state.jwtToken);
			setInstagramName(meFb.name);
			console.log('eee ' + meFb.name);
		}
		fetchData();
	}, []);

	return (
		<Page>
			<div className="bg-white w-full shadow-md rounded-xl text-text-primary font-primaryFont mb-16">
				<div className="p-12 flex justify-between items-center w-full">
					<img src="/img/logo_sociall.jpg" width="180" alt="autosociall" />
				</div>
				<div className="content container mx-auto px-12 pt-5 pb-20 mb-10">
					<h1 className="text-xl block">Sociall Connections</h1>
					<hr className="my-6" />
					{state.facebookTokenExists && (
						<div className="p-4 border border-gray-100 shadow-md shadow-purple-50 rounded flex items-center justify-between">
							<div className="flex items-center">
								<div className="inline-block mr-3">
									<Image src="/img/instagram.png" width={40} height="auto" />
								</div>
								<div className="inline-block">
									<span className="text-sm block mb-1 font-semibold">
										Instagram Account
									</span>
									{instagramName}{' '}
									<span className="bg-lime-200 text-lime-700 border border-lime-300 font-medium rounded py-1 px-2 text-xs">
										Active
									</span>
								</div>
							</div>

							<div>
								<Disconnect token={state.jwtToken} dispatch={dispatch} />
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="text-center mb-20">
				<small className="text-sm text-slate-700">&copy;2024 Auto</small>
			</div>
		</Page>
	);
}
