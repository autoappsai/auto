import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Page } from "@shopify/polaris";
import EmptyCard from "../components/EmptyCard";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { appInit, login, getSession, initTokenFlow  } from "../dao";


export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const { searchParams } = new URL(request.url);
  const shop = searchParams.get("shop");

  const session = await getSession(shop);

  const initResponse = await appInit({
    shop: shop,
    accessToken: session.accessToken,
    shopifyAppUrl: process.env.SHOPIFY_APP_URL,
    shopifyApiKey: process.env.SHOPIFY_API_KEY,
    shopifyApiSecret: process.env.SHOPIFY_API_SECRET
  });

  const { token } = await login({
    username: shop,
    password: session.accessToken,
  });

  process.env.JWT_TOKEN = token;

  process.env.INSTALLATION_ID = initResponse.installations.id;
  process.env.SOCIAL_NETWORK_ID = initResponse.socialNetworks.id;
  process.env.INST_SN_ID = initResponse.id;
  process.env.TOKEN_READY = false;

  if (initResponse.token !== null && initResponse.token !== "Pending") {
    process.env.TOKEN_READY = true;
  }



  const query = `
        {
          products(first: 100) {
            edges {
              node {
                id
                title
                description
                images(first: 3) {
                  edges {
                    node {
                      url
                    }
                  }
                }
                variants(first: 1) {
                  edges {
                    node {
                      price
                      sku
                    }
                  }
                }
              }
            }
          }
        }
  `;

  const response = await admin.graphql(query);
  const response_json = await response.json();

  return json({
    TOKEN_READY: process.env.TOKEN_READY,
    JWT_TOKEN: process.env.JWT_TOKEN,
    products: response_json.data.products.edges,
  });
};

export default function Index() {
  const loaderData = useLoaderData();

  const [instaToken, setInstaToken] = useState(
    loaderData.TOKEN_READY === "true"
  );
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const weekdays = 6;

  const { products } = useLoaderData();

  // define the day of the week
  // Get today's date
  const today = new Date();
  // Array to hold day labels
  const dayLabels = ["Today"];

  console.log({ JWT_TOKEN: loaderData.JWT_TOKEN });

  // Loop to generate labels for the upcoming weekdays
  for (let i = 1; i <= weekdays; i++) {
    const nextDay = new Date();
    nextDay.setDate(today.getDate() + i);
    // Push the label for the next day
    dayLabels.push(nextDay.toLocaleString("en-US", { weekday: "long" }));
  }

  async function authFB() {
    initTokenFlow(loaderData.JWT_TOKEN);

    var url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=761954749115582&display=popup&redirect_uri=https://auto-testing-remix-js.vercel.app/oauth&response_type=token&scope=instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement,page_events,pages_manage_cta`;
    var width = 600;
    var height = 400;

    var left = screen.width / 2 - width / 2;
    var top = screen.height / 2 - height / 2;

    var features =
      "width=" + width + ",height=" + height + ",top=" + top + ",left=" + left;

    var fbWindow = window.open(url, "fbLogin", features);

    if (fbWindow) {
      fbWindow.focus();
      
      if (fbWindow) {
        var checkClosed = setInterval(function () {
          if (fbWindow.closed) {
            clearInterval(checkClosed);
            fbWindow = null;
            window.location.reload();
          }
        }, 500);
      }
    }
  }

  async function logout() {
    await initTokenFlow(loaderData.JWT_TOKEN);
    window.location.reload();
  }

  return (
    <Page>
      {/* {instaToken && (<button className="bg-green-500 text-white py-3 px-6 fixed right-0 top-auto align-middle text-base"><div className="inline-block mr-1 align-middle"><AnimatedSaveIcon /></div> Save Week</button>)} */}
      <div className="bg-white w-full shadow-md rounded-xl text-text-primary font-primaryFont mb-16">
        <div className="p-12 flex justify-between items-center w-full">
          <img src="/img/logo_sociall_t.jpg" width="180" alt="autosociall" />
        </div>

        <div className="content">
          {instaToken ? (
            <>
              <div className="cards lg:grid lg:grid-cols-2 gap-8 bg-gray-100 p-12">
                <div className="lg:col-span-2">
                  <h1 className="text-2xl font-bold">
                    Manage Your Weekly Schedule - <span style={{cursor: "pointer"}} onClick={() => logout()}>Logout</span>
                  </h1>
                  <p className="text-sm mt-3">
                    Generated posts will be automatically published based on the
                    day and time of the day you defined. Days without generated
                    posts will not post to your Instagram account.
                  </p>
                </div>
                {dayLabels.map((label, index) => (
                  <AnimatePresence>
                    <EmptyCard
                      card={label}
                      products={products}
                      INST={loaderData.INST_SN_ID}
                    />
                  </AnimatePresence>
                ))}
              </div>
            </>
          ) : (
            <div className="insta-connect w-full relative grid grid-cols-12">
              <div className="lg:col-span-10 lg:col-start-2 text-center p-12 rounded mb-12">
                <h1 className="text-text-primary text-2xl font-semibold mb-4">
                  Connect to Instagram
                </h1>
                <p className="font-regular text-text-primary text-base">
                  We must connect to your Intagram account to start generating
                  your posts.
                </p>
                <div className="conection-block-instagram flex w-full justify-center items-center mt-8">
                  <div>
                    <img
                      src="/img/large_instagram_connect.png"
                      width="76"
                      height="75"
                      alt="instagram icon to connect to your account"
                    />
                  </div>
                  <div className="mx-5">
                    <img src="/img/connection_arrows.png" width="41" />
                  </div>
                  <div>
                    <img src="/img/auto_connection.png" width="81" />
                  </div>
                </div>
                <button
                  target="_blank"
                  onClick={() => authFB()}
                  className="py-4 px-10 bg-black text-white text-base font-bold mt-8 rounded"
                >
                  Connect Now
                </button>
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
