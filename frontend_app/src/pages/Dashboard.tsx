import axios from "axios";
import { embedDashboard } from "@superset-ui/embedded-sdk";

const supersetUrl = "http://localhost:8088";
const supersetApiUrl = supersetUrl + "/api/v1/security";
const dashboardId = "a83e92cd-4afb-4458-a3d0-842bcf4e2807";

async function getToken() {
  //calling login to get access token
  const login_body = {
    password: "mark",
    provider: "db",
    refresh: true,
    username: "mark",
  };

  const login_headers = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  console.log(supersetApiUrl + "/login");
  const { data } = await axios.post(
    supersetApiUrl + "/login",
    login_body,
    login_headers
  );
  const access_token = data["access_token"];
  console.log(access_token);

  // Calling guest token
  const guest_token_body = JSON.stringify({
    resources: [
      {
        type: "dashboard",
        id: dashboardId,
      },
    ],
    rls: [],
    user: {
      username: "report-viewer",
      first_name: "report-viewer",
      last_name: "report-viewer",
    },
  });

  const guest_token_headers = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + access_token,
    },
  };

  console.log(supersetApiUrl + "/guest_token/");
  console.log(guest_token_body);
  console.log(guest_token_headers);
  await axios
    .post(
      supersetApiUrl + "/guest_token/",
      guest_token_body,
      guest_token_headers
    )
    .then((dt) => {
      console.log(dt.data["token"]);
      const mountPoint = document.getElementById("superset-container");
      if (mountPoint) {
        embedDashboard({
          id: dashboardId, // given by the Superset embedding UI
          supersetDomain: supersetUrl,
          mountPoint: mountPoint, // html element in which iframe render
          fetchGuestToken: () => dt.data["token"],
          dashboardUiConfig: { hideTitle: true },
        });
      }
    });

  var iframe = document.querySelector("iframe");
  if (iframe) {
    iframe.style.width = "300%"; // Set the width as needed
    iframe.style.minHeight = "100vw"; // Set the height as needed
  }
}

function DashboardPage() {
  getToken();

  return (
    <div style={{ marginLeft: '220px', padding: '20px' }}>
      <div id="superset-container"></div> 
    </div>
  );
}

export default DashboardPage;
