import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Page } from "@shopify/polaris";
import EmptyCard from "../components/EmptyCard";
import { createPost, getPosts, initTokenFlow } from "../dao";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AnimatedSaveIcon from "../components/SaveIcon";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const query = `
        {
          products(first: 50) {
            edges {
              node {
                id
                title
                description
                images(first: 1) {
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
    INSTALLATION_ID: process.env.INSTALLATION_ID,
    SOCIAL_NETWORK_ID: process.env.SOCIAL_NETWORK_ID,
    INST_SN_ID: process.env.INST_SN_ID,
    TOKEN_READY: process.env.TOKEN_READY,
    products: response_json.data.products.edges,
  });
};

export default function Index() {
  const loaderData = useLoaderData();

  const [instaToken, setInstaToken] = useState(
    loaderData.TOKEN_READY === "true",
  ); //temporarily set this to true to bypass auth
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const weekdays = 6;

  const { products } = useLoaderData();

  // define the day of the week
  // Get today's date
  const today = new Date();
  // Array to hold day labels
  const dayLabels = ["Today"];

  // Loop to generate labels for the upcoming weekdays
  for (let i = 1; i <= weekdays; i++) {
    const nextDay = new Date();
    nextDay.setDate(today.getDate() + i);
    // Push the label for the next day
    dayLabels.push(nextDay.toLocaleString("en-US", { weekday: "long" }));
  }

  async function authFB() {
    initTokenFlow(loaderData.INST_SN_ID);

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
    }
  }

  async function exampleCreatePost() {
    const post = {
      text: "A text2.",
      hashtags: "#hashtags",
      imageUrl: "url",
      postDate: "2024-02-25T00:00:00.000Z",
      timeOfDay: "Morning",
      installations_SocialNetworks_id: loaderData.INST_SN_ID,
    };

    const newPost = await createPost(post);
    console.log("Post" + JSON.stringify(newPost));
    // Return will be like: {"id":34,"installations_SocialNetworks_id":1,"text":"A text2.","hashtags":"#hashtags","imageUrl":"url","postDate":"2024-02-25T00:00:00.000Z","timeOfDay":"Morning","sent":false,"createdAt":"2024-03-08T02:15:19.789Z"}
  }

  async function exampleUpdatePost() {
    const post = {
      id: 1,
      text: "A text3.",
      hashtags: "#hashtags",
      imageUrl: "url",
      postDate: "2024-02-25T00:00:00.000Z",
      timeOfDay: "Morning",
      installations_SocialNetworks_id: loaderData.INST_SN_ID,
    };

    const newPost = await createPost(post);
    console.log("Post" + JSON.stringify(newPost));
    // Return will be like: {"id":34,"installations_SocialNetworks_id":1,"text":"A text2.","hashtags":"#hashtags","imageUrl":"url","postDate":"2024-02-25T00:00:00.000Z","timeOfDay":"Morning","sent":false,"createdAt":"2024-03-08T02:15:19.789Z"}
  }

  async function exampleGetPosts() {
    const params = {
      date: "2023-02-25T00:00:00.000Z",
      installationsSocialNetworks_id: loaderData.INST_SN_ID,
    };

    const posts = await getPosts(params);
    console.log("Postss" + JSON.stringify(posts));
    // Return will be like: {"id":34,"installations_SocialNetworks_id":1,"text":"A text2.","hashtags":"#hashtags","imageUrl":"url","postDate":"2024-02-25T00:00:00.000Z","timeOfDay":"Morning","sent":false,"createdAt":"2024-03-08T02:15:19.789Z"}
  }

  return (
    <Page>
      {instaToken && (
        <button className="bg-green-500 text-white py-3 px-6 fixed right-0 top-auto align-middle text-base">
          <div className="inline-block mr-1 align-middle">
            <AnimatedSaveIcon />
          </div>{" "}
          Save Week
        </button>
      )}
      <div className="bg-white w-full shadow-md rounded-xl text-text-primary font-primaryFont mb-16">
        <div className="p-12 flex justify-between items-center w-full">
          <img src="/img/logo_sociall.jpg" width="125" alt="autosociall" />
        </div>

        <div className="content">
          {instaToken ? (
            <>
              <div className="cards lg:grid lg:grid-cols-2 gap-8 bg-gray-100 p-12">
                <div className="lg:col-span-2">
                  <h1 className="text-2xl font-bold">
                    Manage Your Weekly Schedule
                  </h1>
                  <p className="text-sm mt-3">
                    Generated posts will be automatically published based on the
                    day and time of the day you defined. Days without generated
                    posts will not post to your Instagram account.
                  </p>
                </div>
                {dayLabels.map((label, index) => (
                  <AnimatePresence>
                    <EmptyCard card={label} products={products} />
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
