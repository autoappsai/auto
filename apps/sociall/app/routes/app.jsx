import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { authenticate } from "../shopify.server";
import { appInit, login, setJwtToken } from "../dao";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  const initResponse = await appInit({
    shopifyClientId: process.env.SHOPIFY_API_KEY,
    shopifyAppUrl: process.env.SHOPIFY_APP_URL,
    shopifyApiKey: process.env.SHOPIFY_API_KEY,
    shopifyApiSecret: process.env.SHOPIFY_API_SECRET,
    socialNetworkName: "Instagram",
  });

  const { token } = await login({
    username: process.env.SHOPIFY_API_KEY,
    password: process.env.SHOPIFY_API_SECRET,
  });

  process.env.JWT_TOKEN = token;

  process.env.INSTALLATION_ID = initResponse.installations.id;
  process.env.SOCIAL_NETWORK_ID = initResponse.socialNetworks.id;
  process.env.INST_SN_ID = initResponse.id;
  process.env.TOKEN_READY = false;

  if (initResponse.token !== null && initResponse.token !== "Pending") {
    process.env.TOKEN_READY = true;
  }

  return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
};

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <ui-nav-menu>
        <Link to="/app" rel="home">
          Home
        </Link>
        <Link to="/app/additional">Additional page</Link>
      </ui-nav-menu>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
