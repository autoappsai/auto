import { json } from "@remix-run/node";
import { saveLongLivedTokenToLatest } from "../dao";
import { getLongLivedToken } from "../fb";

// Used after Oauth comeback.
export const loader = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get("access_token");

  const longLivedToken = await getLongLivedToken(accessToken);

  const installations_SocialNetwork = await saveLongLivedTokenToLatest(
    longLivedToken
  );

  return json(installations_SocialNetwork);
};
