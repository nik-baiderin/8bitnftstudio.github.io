//const telegramID = Telegram.WebApp.initDataUnsafe.user.id;
let telegramID = 466016637;
if (!telegramID) {
  console.error("Telegram ID not available");
}

const apiSignIn = async () => {
  const formData = new FormData();
  formData.append("username", "diana@best.com");
  formData.append("password", "artemprivet");
  const response = await fetch("http://80.78.243.93:8000/token", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  accessToken = data.access_token;
  return accessToken;
};

const apiGetProfile = async () => {
  const response = await fetch(
    `https://gptkids.online/clicker-backend/api/user/${telegramID}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await response.json();
  const profile = data.users[0];
  return profile;

  // .then((response) => response.json())
  // .then((data) => {
  //   if (!Array.isArray(data.users) || data.users.length === 0) {
  //     throw new Error("Invalid response structure or empty users array");
  //   }

  //   let userData = data.users[0];
  //   initialcounter = userData.gamecount;
  //   counter = userData.gamecount;
  //   counterElement.textContent = counter;
  //   balance.textContent = "Общий баланс профиля: " + userData.totalcount;
  //   level = userData.clickup;
  //   restorelevel = userData.recoveryup;
  //   uplevel = userData.energyup;
  //   haveskin1 = userData.skin1;
  //   haveskin2 = userData.skin2;
  //   haveskin3 = userData.skin3;
  //   haveskin4 = userData.skin4;
  //   currentDate = userData.date;
  //   currentTime = userData.time;
  //   serverData = userData.serverdate;
  //   serverTime = userData.servertime;
  //   loadenergy = userData.endenergy;
  //   progressBar.value = loadenergy;

  //   if (haveskin1) {
  //     document.getElementById("price-1").textContent = "Куплено!";
  //   }
  //   if (haveskin2) {
  //     document.getElementById("price-2").textContent = "Куплено!";
  //   }
  //   if (haveskin3) {
  //     document.getElementById("price-3").textContent = "Куплено!";
  //   }
  //   if (haveskin4) {
  //     document.getElementById("price-4").textContent = "Куплено!";
  //   }
  // })
  // .catch((error) => console.error("Error loading count:", error));
};

// const displayBalance = () => {};

const init = async () => {
  const accessToken = await apiSignIn();
  const profile = await apiGetProfile();
  document.querySelector(".balance_score").textContent = profile.gamecount;
};

init();
