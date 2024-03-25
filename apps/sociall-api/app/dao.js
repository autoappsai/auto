import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function toMySQLFormat(date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export async function initTokenFlow(shop) {
  await prisma.$queryRaw`
    update sociall.Installations_SocialNetworks isn, sociall.Installations i
    set isn.token = "Pending", isn.userId = "Pending", isn.createdAt = ${toMySQLFormat(new Date())}
    where isn.installations_id = i.id
    and i.shop = ${shop}`;
}

export async function saveLongLivedTokenToLatest(longLivedToken) {
  const latestRow = await prisma.installations_SocialNetworks.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!latestRow) {
    throw new Error("No rows found.");
  }

  const installations_SocialNetwork = await prisma.installations_SocialNetworks.update({
    where: {
      id: latestRow.id,
    },
    data: { token: longLivedToken, createdAt: new Date().toISOString() },
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
    data: { sent: true },
  });

  return updatePosts;
}

export async function markAllPostsAsSent() {
  const updatePosts = await prisma.post.updateMany({
    where: {
      sent: false,
    },
    data: { sent: true },
  });

  return updatePosts;
}

export async function appInit(installationParam, socialNetworkName) {
  const installation = await prisma.installations.upsert({
    where: {
      shop: installationParam.shop,
    },
    update: {accessToken: installationParam.accessToken},
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

  const installations_SocialNetwork = await prisma.installations_SocialNetworks.upsert({
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
      token: "Pending",
      userId: "Pending",
    },
  });

  return installations_SocialNetwork;
}

export async function getInstallation(shop) {
  const installation = await prisma.installations.findUnique({
    where: {
      shop: shop,
    },
  });

  return installation;
}

export async function createPost(aPost, shop, socialNetworkName) {
  const installations_SocialNetwork = await prisma.installations_SocialNetworks.findFirst({
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
    update: { ...aPost },
    create: { ...aPost },
  });

  return post;
}
