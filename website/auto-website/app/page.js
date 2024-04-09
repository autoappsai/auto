'use client';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import Head from 'next/head';
import { useEffect, useState } from 'react';
export default function Home() {
	const scrollVariants = {
		animate: {
			x: [0, -1600],
			transition: {
				x: {
					repeat: Infinity,
					repeatType: 'loop',
					duration: 10, // Adjust duration for speed control
					ease: 'linear',
				},
			},
		},
	};

	const controls = useAnimation();
	const [hasScrolled, setHasScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => {
			if (window.scrollY > window.innerHeight - 100) {
				if (!hasScrolled) {
					controls.start({
						backgroundColor: '#FFFEE7',
						transition: { duration: 1 },
					});
					setHasScrolled(true);
				}
			} else {
				if (hasScrolled) {
					controls.start({
						backgroundColor: '#000',
						transition: { duration: 1 },
					});
					setHasScrolled(false);
				}
			}
		};

		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, [controls, hasScrolled]);

	useEffect(() => {
		document.documentElement.classList.add('snap-y', 'snap-mandatory');
		return () => {
			document.documentElement.classList.remove('snap-y', 'snap-mandatory');
		};
	}, []);

	return (
		<motion.div
			animate={controls}
			style={{ height: '200vh', backgroundColor: '#000' }} // Set the initial color
			className="relative"
		>
			<Head>
				<link rel="icon" type="image/png" href="/favicon.png" sizes="any" />
			</Head>
			<div className="-rotate-45 fixed -mt-[40rem]">
				<motion.div
					variants={scrollVariants}
					animate="animate"
					style={{ display: 'inline-block' }}
				>
					<span className="lg:text-[25rem] text-[10rem] font-bold opacity-10">
						Auto
					</span>
				</motion.div>
			</div>
			<div className="snap-mandatory snap-y z-50">
				<header className="flex justify-center w-full flex-wrap h-screen items-center px-20 snap-start relative">
					<div className="ml-10 absolute top-12 left-10">
						<Image src="/logo.png" width="132" height="41" />
					</div>
					<div className="z-50">
						<div className="lg:text-[10rem] animate-text  text-[5rem] font-extrabold lg:leading-[8rem]  leading-[4rem] bg-clip-text pb-10 text-transparent bg-gradient-to-r from-[#EE7DFF] via-[#FFFEE7] to-[#47C9FF]">
							<span>Artificially</span>
							<br />
							<span>Intelligent</span>
							<br />
							<span>Apps.</span>
						</div>
						<div className="w-full flex justify-center">
							<div className="lg:max-w-[850px] mt-3 text-[#727A88] text-lg">
								Our cutting-edge, AI-driven apps are designed to transform your
								online business, making operations smoother and enhancing the
								shopping experience. Embrace innovation with AUTO and unlock the
								full potential of your ecommerce venture. Welcome to the future
								of retail.
							</div>
						</div>
					</div>
					{/* <div className="absolute bottom-0 left-auto w-full z-0 overflow-hidden">
						<img
							src="/bg5-main.webp"
							width="800px"
							height="800px"
							className="opacity-25 mx-auto"
						/>
					</div> */}
				</header>
				<div className="lg:grid animate-text lg:grid-cols-2 h-screen items-center snap-start bg-gradient-to-br from-purple-600 via-[#fffb86] to-[#47C9FF] gap-10 px-10">
					<Image src="/sociall-screenshots.png" width={768} height={716} />
					<div className="desc">
						<h3 className="text-5xl text-[#333] font-extrabold tracking-tight">
							Sociall for Shopify
						</h3>
						<p className="text-slate-600 mt-4 lg:pr-20">
							Sociall is the ultimate Shopify companion for the social media
							savvy retailer. This innovative plugin transforms your Shopify
							catalog into a dynamic social media content calendar. With
							Sociall, scheduling and posting your products on Instagram becomes
							effortless and automatic. Keep your feed fresh and your followers
							engaged without lifting a finger. Say goodbye to manual uploads
							and embrace the seamless integration of Sociall – where your
							store&apos;s charm meets Instagram&apos;s buzz.
						</p>
						<span className="py-3 px-8 text-white rounded bg-slate-900 font-bold inline-block mt-4 cursor-pointer transition-all duration-300 hover:shadow-slate-500 hover:shadow-lg">
							<Image
								src="/shopi.png"
								width={26}
								height={26}
								className="inline-block mr-2"
							/>
							Try Now
						</span>

						<div className="flex mt-8">
							<div>
								<strong className="text-slate-600">Available for:</strong>
								<Image
									src="/instagram.png"
									width={25}
									height={25}
									className="inline-block ml-2"
								/>
							</div>
							<div>
								<strong className="text-slate-600 ml-12">Coming Soon:</strong>
								<Image
									src="/fb.png"
									width={24}
									height={24}
									className="inline-block ml-3"
								/>
								<Image
									src="/x.png"
									width={25}
									height={25}
									className="inline-block ml-3"
								/>
								<Image
									src="/pin.png"
									width={24}
									height={24}
									className="inline-block ml-3"
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="flex justify-center flex-wrap h-screen items-center snap-start">
					<div className="text-center">
						<h3 className="text-white font-bold text-4xl">Sign Up For News</h3>
						<br />
						<input
							className="p-3 border-2 border-purple-400 rounded w-[300px] text-purple-900 focus:outline-none"
							placeholder="Your Email"
						/>
						<p className="text-[#C4CDD] mt-8">
							There are new apps in their way. Get to know them first.
						</p>
					</div>
				</div>
				<div className="flex justify-center flex-wrap h-screen items-center snap-start">
					<div className="text-center">
						<p className="text-[#C4CDD] mt-8">
							©2024 - Auto, LLC /{' '}
							<span className="underline underline-offset-4">Support</span>
						</p>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
