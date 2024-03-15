import { json } from "@remix-run/node";
import { getTodaysNotSentPosts, markTodaysPostsAsSent } from "../dao";
import { instagramPublish } from "../fb";

export const loader = async () => {
  return json({ error: "Invalid request method" }, { status: 405 });
};

export const action = async ({ request }) => {
  switch (request.method) {
    case "POST": {
      const body = await request.json();
      const posts = await getTodaysNotSentPosts(body.timeOfDay);
      let publications = [];

      if (posts !== null && posts.length > 0) {
        for (const post of posts) {
          const publicationId = await instagramPublish(
            post.imageUrl,
            post.text + " \n" + post.hashtags,
            post.installations_SocialNetworks.token
          );
          publications.push(publicationId);
        }

        markTodaysPostsAsSent(body.timeOfDay);
      }

      return json(publications);
    }
  }
};
