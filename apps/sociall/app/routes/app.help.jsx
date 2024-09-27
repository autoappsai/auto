import { Image, Page } from '@shopify/polaris';

export default function Settings() {
	return (
		<Page>
			<div className="bg-white w-full shadow-md rounded-xl text-text-primary font-primaryFont mb-16">
				<div className="content container mx-auto px-12 pt-5 pb-20 mb-10">
					<h1 className="text-xl block">
						<img
							src="/img/sociall_icon_2.png"
							width="50"
							alt="autosociall"
							className="inline-block mr-2 align-middle"
						/>
						Sociall Help
					</h1>
					<hr className="my-10" />
					<div>
						{' '}
						<h3 className="font-bold text-xl">Requirements</h3> <br />{' '}
						<p className="text-base font-normal">
							{' '}
							<strong className="block mb-4">
								{' '}
								<Image
									src="/img/shopify.png"
									width="20"
									height="20"
									className="inline-block mr-1 align-middle"
								/>{' '}
								Shopify{' '}
							</strong>{' '}
							There are no specific requirements for your Shopify store. A
							standard store should work without any issues. <br />
							<br />{' '}
							<strong className="block mb-4">
								{' '}
								<Image
									src="/img/fb.png"
									width="20"
									height="20"
									className="inline-block mr-1 align-middle"
								/>{' '}
								Facebook{' '}
							</strong>{' '}
							- You must have an active Facebook account. <br /> - The Facebook
							account must be connected to your Instagram account. <br />
							<br />{' '}
							<strong className="block mb-4">
								{' '}
								<Image
									src="/img/instagram.png"
									width="20"
									height="20"
									className="inline-block mr-1 align-middle"
								/>{' '}
								Instagram{' '}
							</strong>{' '}
							- Your Instagram account must be set as a{' '}
							<strong>business account</strong>.{' '}
						</p>{' '}
					</div>
					<hr className="my-10" />
					<div>
						{' '}
						<h3 className="font-bold text-xl">What is Sociall?</h3>
						<br />{' '}
						<p className="text-base font-normal">
							{' '}
							Sociall is a Shopify plugin that automatically connects with your
							product catalog and generates Instagram posts using AI generative
							techniques.
							<br />
							<br />
							Sociall will randomly pick products and images from your catalog
							and create a preview of how your post will look. <br />
							<br /> <strong>Content Control</strong>
							<br />
							<br /> There are 3 ways you can control what gets posted on
							Instagram.
							<br />
							<br />{' '}
							<ol>
								{' '}
								<li>
									<strong>1) Content Regeneration:</strong> Regenerate the post
									content provided by AI, while keeping the selected product and
									image.
								</li>
								<br />{' '}
								<li>
									<strong>2) Manual Regeneration:</strong> If you want to
									manually edit the generated content, simply double-click on it
									to make changes.
								</li>
								<br />{' '}
								<li>
									<strong>3) Complete Regeneration:</strong> Completely replace
									the product and content previously generated.
								</li>
								<br />{' '}
							</ol>{' '}
							To perform any of these actions, you will find clear instructions
							(e.g., buttons, help tips) in the Sociall UI.{' '}
						</p>{' '}
					</div>
					<hr className="my-10" />
					<div>
						{' '}
						<h3 className="font-bold text-xl">Post Scheduling</h3> <br />{' '}
						<p className="text-base font-normal">
							{' '}
							<strong>Sociall</strong> runs on a weekly schedule, allowing you
							to view your next 7 upcoming days of posts. <br />
							<br /> If you have a post scheduled for "Monday," once that Monday
							has passed and the post is published (if you had any scheduled for
							that day), Sociall will then show the next Monday as available to
							schedule a new post. <br />
							<br /> The strategy is up to the user—whether you want to schedule
							a post for the same day as soon as it passes or wait until more
							days have passed to create the next schedule. <br />
							<br /> <strong>Time of Day</strong> <br />
							<br /> You can choose a time of day instead of a specific hour.
							The options are: Morning, Midday, Afternoon, Late Afternoon, and Night. <br />
							<br />{' '}
							<br/>
							<strong className='text-lg block mb-4'>Times Reference table:</strong>
							<table className='table-fixed p-5 border border-slate-200'>
								<thead className='border-b-2 border-slate-200'>
									<th className='text-left py-2 px-4 w-[200px]'>Label</th>
									<th className='text-left py-2 pl-1 pr-4'>Publish time</th>
								</thead>
								<tbody className='text-sm'>
									<tr>
									<td className='py-2 px-4'>Morning</td>
									<td className='py-2 px-1'>8:00 AM ET</td>
									</tr>
									<tr>
									<td className='py-2 px-4'>Midday</td>
									<td className='py-2 px-1'>12:00 AM ET</td>
									</tr>
									<tr>
									<td className='py-2 px-4'>Afternoon</td>
									<td className='py-2 px-1'>2:00 PM ET</td>
									</tr>
									<tr>
									<td className='py-2 px-4'>Late Afternoon</td>
									<td className='py-2 px-1'>5:00 PM ET</td>
									</tr>
									<tr>
									<td className='py-2 px-4'>Night</td>
									<td className='py-2 px-1'>9:00 PM ET</td>
									</tr>
								</tbody>
							</table>
						</p>{' '}
					</div>

					<hr className="my-10" />
					<div>
						<h3 className="font-bold text-xl">Questions & Bugs?</h3>
						<br />
						<p className="text-base font-normal">
							Please contact us at{' '}
							<a
								href="mailto:team@autoapps.ai"
								className="font-semibold underline underline-offset-4"
							>
								team@autoapps.ai
							</a>
						</p>
					</div>
				</div>
			</div>
			<div className="text-center mb-20">
				<small className="text-sm text-slate-700">&copy;2024 Auto</small>
			</div>
		</Page>
	);
}
