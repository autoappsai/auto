import { Image, Page } from '@shopify/polaris';
import Disconnect from '../components/Disconnect';
import { useGlobalState } from '../context';

export default function Settings() {
	const { state, dispatch } = useGlobalState();
	return (
		<Page>
			<div className="bg-white w-full shadow-md rounded-xl text-text-primary font-primaryFont mb-16">
				<div className="p-12 flex justify-between items-center w-full">
					<img src="/img/logo_sociall.jpg" width="180" alt="autosociall" />
				</div>
				<div className="content container mx-auto px-12 pt-5 pb-20 mb-10">
					<h1 className="text-xl block">Sociall Connections</h1>
					<hr className="my-6" />
					<div className="p-4 border border-gray-100 shadow-md shadow-purple-50 rounded flex items-center justify-between">
						<div className="flex items-center">
							<div className="inline-block mr-3">
								<Image src="/img/instagram.png" width={40} height="auto" />
							</div>
							<div className="inline-block">
								<span className="text-sm block mb-1 font-semibold">
									Instagram Account
								</span>
								@mpaezmolina{' '}
								<span className="bg-lime-200 text-lime-700 border border-lime-300 font-medium rounded py-1 px-2 text-xs">
									Active
								</span>
							</div>
						</div>

						<div>
							{/* <button
								className="py-1 px-3 rounded border border-slate-500 text-sm font-semibold hover:shadow-lg hover:shadow-purple-200 transition-all duration-300"
								onClick={() => console.log('logged out')}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="w-6 h-6 stroke-slate-500 inline-block mr-1"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M11.412 15.655 9.75 21.75l3.745-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25 12 10.5h8.25l-4.707 5.043M8.457 8.457 3 3m5.457 5.457 7.086 7.086m0 0L21 21"
									/>
								</svg>
							</button> */}
							<Disconnect token={state.jwtToken} dispatch={dispatch} />
						</div>
					</div>
				</div>
			</div>
			<div className="text-center mb-20">
				<small className="text-sm text-slate-700">&copy;2024 Auto</small>
			</div>
		</Page>
	);
}
