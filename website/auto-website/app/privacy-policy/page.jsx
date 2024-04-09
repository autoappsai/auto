import Image from 'next/image';
export default function PrivacyPolicy() {
	return (
		<div className="container mx-auto">
			<div className="grid grid-cols-12">
				<div className="col-start-3 col-span-8 my-20 text-[#727A88]">
					<Image src="/logo.png" width="132" height="41" />
					<span className="bg-[#1BFF9F] text-black absolute top-10 right-10 font-semibold px-3 py-1 rounded text-sm">
						Effective Date: March 9, 2024
					</span>
					<p className="mt-10">
						<h1 className="text-3xl my-6 text-white font-bold">Introduction</h1>
						<p className="my-6">
							This Privacy Policy describes how AUTO (Docta LLC) ("we," "us," or
							"our") collects, uses, and discloses your information when you
							visit our website (the "Website").
						</p>
						<h3 className="text-white font-semibold text-xl">
							Information We Collect
						</h3>
						<p className="my-6">
							We only collect personal information from you if you choose to
							provide it to us by signing up for our communications. The
							personal information we collect may include your email address.
						</p>
						<p className="my-6">
							We may also collect non-personal information about your use of the
							Website, such as your browsing history, IP address, device
							information, and website usage statistics. This information is
							collected through cookies and similar tracking technologies.
						</p>
						<h3 className="text-white font-semibold text-xl">
							How We Use Your Information
						</h3>
						<p className="my-6">
							We use the information we collect to:
							<ul className="list-disc list-inside my-4">
								<li>Provide and improve the Website and our services </li>
								<li>
									Send you communications (with your consent) such as
									newsletters or promotional emails
								</li>
								<li>Analyze website traffic and user behavior</li>
							</ul>
						</p>
						<h3 className="text-white font-semibold text-xl">
							Information Sharing and Disclosure
						</h3>
						<p className="my-6">
							We will not sell or share your personal information with any third
							party without your consent.
						</p>
						<p className="my-6">
							We may share your personal information with third-party service
							providers who help us operate the Website and provide our
							services.
							<br />
							These service providers are contractually obligated to keep your
							information confidential and to use it only for the purposes we
							have disclosed to them.
						</p>
						<p className="my-6">
							We may also disclose your personal information if required to do
							so by law or in the good faith belief that such disclosure is
							necessary to comply with a court order, subpoena, or other legal
							process served on us, or to protect and defend our rights or
							property.{' '}
						</p>
						<h3 className="text-white font-semibold text-xl">Data Security</h3>
						<p className="my-6">
							We take reasonable steps to protect the information you provide to
							us from loss, misuse, unauthorized access, disclosure, alteration,
							and destruction. However, no internet or electronic storage system
							is 100% secure. Therefore, we cannot guarantee the absolute
							security of your information.{' '}
						</p>
						<h3 className="text-white font-semibold text-xl">
							User Choices and Control
						</h3>
						<p className="my-6">
							You can opt out of receiving marketing communications from us by
							following the unsubscribe instructions in those communications.
							You can also request to access, update, or delete your personal
							information by contacting us at team@autoapps.ai.
						</p>
						<h3 className="text-white font-semibold text-xl">Cookies</h3>
						<p className="my-6">
							We use cookies and similar tracking technologies to collect and
							store non-personal information about your use of the Website.
							<br /> You can control or disable cookies through your browser
							settings.However, disabling cookies may limit your ability to use
							certain features of the Website.
						</p>
						<h3 className="text-white font-semibold text-xl">
							Children's Privacy
						</h3>
						<p className="my-6">
							Our Website is not directed towards children under the age of 13.
							<br />
							<br />
							We do not knowingly collect personal information from children
							under 13.
							<br />
							<br /> If you are a parent or guardian and you believe your child
							has provided us with personal information, please contact us. We
							will take steps to remove the information from our records.
						</p>
						<h3 className="text-white font-semibold text-xl">
							Changes to this Policy
						</h3>
						<p className="my-6">
							We may update this Privacy Policy from time to time. We will
							notify you of any changes by posting the new Privacy Policy on the
							Website. You are advised to review this Privacy Policy
							periodically for any changes.
						</p>
						<h3 className="text-white font-semibold text-xl">Contact Us</h3>
						<p className="my-6">
							If you have any questions about this Privacy Policy, please
							contact us at team@autoapps.ai.
						</p>
					</p>
				</div>
			</div>
		</div>
	);
}
