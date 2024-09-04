import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function toMySQLFormat(date) {
	return date.toISOString().slice(0, 19).replace('T', ' ');
}

export async function initTokenFlow(shop) {
  await prisma.$queryRaw`
    update defaultdb.Installations_SocialNetworks isn, defaultdb.Installations i
    set isn.token = 'Pending', isn.userId = 'Pending', isn.createdAt = ${toMySQLFormat(new Date())}
    where isn.installations_id = i.id
    and i.shop = ${shop}`;
}

export async function saveLongLivedTokenToLatest(longLivedToken) {
	const latestRow = await prisma.installations_SocialNetworks.findFirst({
		orderBy: {
			createdAt: 'desc',
		},
	});

	if (!latestRow) {
		throw new Error('No rows found.');
	}

	const installations_SocialNetwork =
		await prisma.installations_SocialNetworks.update({
			where: {
				id: latestRow.id,
			},
			data: {
				token: longLivedToken,
				createdAt: new Date().toISOString(),
			},
		});

	return installations_SocialNetwork;
}

function getCurrentDates() {
	let currentDate = new Date();
	let utcTime = currentDate.getTime();

	// Eastern Time (ET) is UTC - 5 hours (standard time)
	let easternTimeOffset = -5;

	// Convert UTC time to Eastern Time
	let fromTimeET = new Date(utcTime + easternTimeOffset * 60 * 60 * 1000);
	let toTimeET = new Date(utcTime + easternTimeOffset * 60 * 60 * 1000);

	fromTimeET.setUTCHours(0, 0, 0, 0);
	toTimeET.setUTCHours(23, 59, 59, 0);

	return [fromTimeET.toISOString(), toTimeET.toISOString()];
}

// Morning: 8am, cron 0 8 * * *
// Midday: 12pm, cron 0 12 * * *
// Afternoon: 2pm, cron 0 14 * * *
// Late afternoon: 5pm, cron 0 17 * * *
// Night: 9pm, cron 0 21 * * *
export async function getTodaysNotSentPosts(timeOfDay) {
	const [fromDate, toDate] = getCurrentDates();

	const posts = await prisma.post.findMany({
		where: {
			sent: false,
			timeOfDay: timeOfDay,
			postDate: {
				lte: toDate,
				gte: fromDate,
			},
		},
		include: {
			installations_SocialNetworks: true,
		},
	});

	return posts;
}

export async function getPosts(date, shop, socialNetworkName) {
	const posts = await prisma.post.findMany({
		where: {
			installations_SocialNetworks: {
				installations: {
					shop: shop,
				},
				socialNetworks: {
					name: socialNetworkName,
				},
			},
			postDate: {
				gte: date,
			},
		},
	});

	return posts;
}

function getWeektDates() {
	let currentDate = new Date();
	let utcTimeCurrent = currentDate.getTime();

	const endDate = new Date(currentDate);
	endDate.setDate(currentDate.getDate() + 7);
	let utcTimeEnd = endDate.getTime();

	// Eastern Time (ET) is UTC - 5 hours (standard time)
	let easternTimeOffset = -5;

	// Convert UTC time to Eastern Time
	let fromTimeET = new Date(
		utcTimeCurrent + easternTimeOffset * 60 * 60 * 1000
	);
	let toTimeET = new Date(utcTimeEnd + easternTimeOffset * 60 * 60 * 1000);

	fromTimeET.setUTCHours(0, 0, 0, 0);
	toTimeET.setUTCHours(0, 0, 0, 0);

	return [fromTimeET.toISOString(), toTimeET.toISOString()];
}

// dateString: "2024-03-31T03:00:00.000Z" format
function getShortDate(dateString) {
	const date = new Date(dateString);

	const year = date.getUTCFullYear();
	const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
	const day = String(date.getUTCDate()).padStart(2, '0');

	// Format the date as "yyyy-mm-dd"
	return `${year}-${month}-${day}`;
}

//   const now = new Date();
export async function getWeekPosts(shop, socialNetworkName) {
	const [fromDate, toDate] = getWeektDates();

	const daysInWeek = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];

	const today = new Date();

	const nextWeekDates = [];

	for (let i = 0; i < 7; i++) {
		const nextDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
		nextDate.setHours(0, 0, 0, 0);
		const formattedDate = nextDate.toISOString();
		const dayOfWeek = daysInWeek[nextDate.getDay()];
		nextWeekDates.push({
			day: dayOfWeek,
			date: formattedDate,
		});
	}

	const posts = await prisma.post.findMany({
		where: {
			installations_SocialNetworks: {
				installations: {
					shop: shop,
				},
				socialNetworks: {
					name: socialNetworkName,
				},
			},
			postDate: {
				lte: toDate,
				gte: fromDate,
			},
		},
	});

	for (let i = 0; i < nextWeekDates.length; i++) {
		const foundIndex = posts.findIndex((post) => {
			return (
				getShortDate(post.postDate.toISOString()) ===
				getShortDate(nextWeekDates[i].date)
			);
		});

		if (foundIndex !== -1) {
			// Change variable names. Maybe this should be done in FE or AI endpoint.
			posts[foundIndex].post_description = posts[foundIndex].text;
			posts[foundIndex].post_hashtags = posts[foundIndex].hashtags;
			delete posts[foundIndex].text;
			delete posts[foundIndex].hashtags;

			nextWeekDates[i].post = posts[foundIndex];
		}
	}

	return nextWeekDates;
}

export async function getPostsFrom(date, installationsSocialNetworks_id) {
	const posts = await prisma.post.findMany({
		where: {
			installations_SocialNetworks_id: parseInt(installationsSocialNetworks_id),
			postDate: {
				gte: date,
			},
		},
	});

	return posts;
}

export async function markTodaysPostsAsSent(timeOfDay) {
	const [fromDate, toDate] = getCurrentDates();

	const updatePosts = await prisma.post.updateMany({
		where: {
			sent: false,
			timeOfDay: timeOfDay,
			postDate: {
				lte: toDate,
				gte: fromDate,
			},
		},
		data: {
			sent: true,
		},
	});

	return updatePosts;
}

export async function markAllPostsAsSent() {
	const updatePosts = await prisma.post.updateMany({
		where: {
			sent: false,
		},
		data: {
			sent: true,
		},
	});

	return updatePosts;
}

export async function appInit(installationParam, socialNetworkName) {
	const installation = await prisma.installations.upsert({
		where: {
			shop: installationParam.shop,
		},
		update: {
			accessToken: installationParam.accessToken,
		},
		create: installationParam,
	});

	const socialNetwork = await prisma.socialNetworks.upsert({
		where: {
			name: socialNetworkName,
		},
		update: {},
		create: {
			name: socialNetworkName,
		},
	});

	const installations_SocialNetwork =
		await prisma.installations_SocialNetworks.upsert({
			include: {
				installations: true,
				socialNetworks: true,
			},
			where: {
				likeId: {
					installations_id: installation.id,
					socialNetworks_id: socialNetwork.id,
				},
			},
			update: {},
			create: {
				installations_id: installation.id,
				socialNetworks_id: socialNetwork.id,
				token: 'Pending',
				userId: 'Pending',
			},
		});

	return installations_SocialNetwork;
}

export async function getInstallation(shop) {
  try {
    const installation = await prisma.installations.findUnique({
      where: {
        shop: shop,
      },
    });

    if (!installation) {
      return null;
    }

    return installation;
  } catch (error) {
    console.error("Database error:", error);
    return null;
  }
}

export async function upsertPost(aPost, shop, socialNetworkName) {
	const installations_SocialNetwork =
		await prisma.installations_SocialNetworks.findFirst({
			where: {
				installations: {
					shop: shop,
				},
				socialNetworks: {
					name: socialNetworkName,
				},
			},
		});

	aPost.installations_SocialNetworks_id = installations_SocialNetwork.id;

	const post = await prisma.post.upsert({
		where: {
			id: aPost.id || 0,
		},
		update: {
			...aPost,
		},
		create: {
			...aPost,
		},
	});

	return post;
}

export async function deletePost(id) {
	const post = await prisma.post.delete({
		where: {
			id: id,
		},
	});
	return post;
}

export async function getInstallations_SocialNetworks(shop, socialNetworkName) {
	const installations_SocialNetwork =
		await prisma.installations_SocialNetworks.findFirst({
			where: {
				installations: {
					shop: shop,
				},
				socialNetworks: {
					name: socialNetworkName,
				},
			},
		});
	return installations_SocialNetwork;
}
