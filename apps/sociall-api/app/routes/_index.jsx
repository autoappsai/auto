import {
  getInstagramBusinessAccount,
  createMediaContainer,
  mediaPublish,
  instagramPublish,
} from "../fb";
function Index() {
  async function click() {
    const id = await getInstagramBusinessAccount(
      "EAAK0ZCmon7L4BO55ifgWJcC7ZB61EraHzLDju3p7hjjUbBypNCAH2eQuMP6c9BC1rIkfXzSZB32zZB24jEjAOZAAmwDzUKZCYixiQoqUwOT8jzrqcGBHZBJPHA8nkjGmxBEIviTm0ehJpO3049wtcBqzFIIiGXVoZCcJA7LR3ZAm0hGdre7V2LkOtlwZDZD"
    );
    console.log("ID " + id);
  }

  async function click2() {
    const id = await createMediaContainer(
      "17841405482006973",
      "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg",
      "Haa",
      "EAAK0ZCmon7L4BO55ifgWJcC7ZB61EraHzLDju3p7hjjUbBypNCAH2eQuMP6c9BC1rIkfXzSZB32zZB24jEjAOZAAmwDzUKZCYixiQoqUwOT8jzrqcGBHZBJPHA8nkjGmxBEIviTm0ehJpO3049wtcBqzFIIiGXVoZCcJA7LR3ZAm0hGdre7V2LkOtlwZDZD"
    );
    console.log("ID2 " + id);
  }

  async function click3() {
    const id = await mediaPublish(
      "17841405482006973",
      "18022769246000776",
      "EAAK0ZCmon7L4BO55ifgWJcC7ZB61EraHzLDju3p7hjjUbBypNCAH2eQuMP6c9BC1rIkfXzSZB32zZB24jEjAOZAAmwDzUKZCYixiQoqUwOT8jzrqcGBHZBJPHA8nkjGmxBEIviTm0ehJpO3049wtcBqzFIIiGXVoZCcJA7LR3ZAm0hGdre7V2LkOtlwZDZD"
    );
    console.log("ID3 " + id);
  }

  async function click4() {
    const id = await instagramPublish(
      "https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg",
      "Haa!!",
      "EAAK0ZCmon7L4BO55ifgWJcC7ZB61EraHzLDju3p7hjjUbBypNCAH2eQuMP6c9BC1rIkfXzSZB32zZB24jEjAOZAAmwDzUKZCYixiQoqUwOT8jzrqcGBHZBJPHA8nkjGmxBEIviTm0ehJpO3049wtcBqzFIIiGXVoZCcJA7LR3ZAm0hGdre7V2LkOtlwZDZD"
    );
    console.log("ID4 " + id);
  }

  return (
    <div>
      <h1>Auto Remix</h1>
      <a
        target="popup"
        onClick={() =>
          window.open(
            "https://www.facebook.com/v19.0/dialog/oauth?client_id=761954749115582&display=popup&redirect_uri=https://auto-testing-remix-js.vercel.app/oauth&response_type=token&scope=instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement,page_events,pages_manage_cta",
            "_blank",
            "rel=noopener noreferrer"
          )
        }
        href="https://www.facebook.com/v19.0/dialog/oauth?client_id=761954749115582&display=popup&redirect_uri=https://auto-testing-remix-js.vercel.app/oauth&response_type=token&scope=instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement,page_events,pages_manage_cta"
      >
        Login to Facebook 761954749115582
      </a>
      <br />
      <button onClick={() => click()}>Insta account</button>
      <br />
      <button onClick={() => click2()}>Create Media</button>
      <br />
      <button onClick={() => click3()}>Publish</button>
      <br />
      <button onClick={() => click4()}>Complete Publish</button>
    </div>
  );
}

export default Index;
