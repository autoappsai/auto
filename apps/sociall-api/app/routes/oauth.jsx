import { useEffect } from "react";
import { useLocation } from "@remix-run/react";

function Oauth() {
  const location = useLocation();

  const hash = location.hash;
  const urlParams = new URLSearchParams(hash);
  const accessToken = urlParams.get("#access_token");

  // This has to be done because FB send token to FE, and protected with #, and we need to extract it, and move it to the BE side for saving.
  useEffect(() => {
    async function saveToken() {
      console.log("Fetch");
      await fetch("save-token?access_token=" + accessToken);
      window.close();
    }
    saveToken();
  }, []);

  return <div></div>;
}

export default Oauth;
