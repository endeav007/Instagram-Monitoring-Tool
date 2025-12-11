const axios = require('axios');
const dotenv = require('dotenv');
const session = require('express-session');

dotenv.config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; //will set to port 3000, OR the users port
const { APP_ID, APP_SECRET, INSTAGRAM_REDIRECT_URI, SESSION_SECRET, INSTAGRAM_ID, OVERWATCH_ID, SPLATOON_ID, VALORANT_ID, TEKKEN_ID, 
MARVELRIVALS_ID, COUNTERSTRIKE_ID, STREETFIGHTER_ID, FORTNITE_ID, SMASH_ID, LEAGUEOFLEGENDS_ID, RAINBOWSIXSIEGE_ID, ROCKETLEAGUE_ID} = process.env;

const CACHE_DURATION = 15 * 60 * 1000;

const cacheMap = {};
const accounts ={
  success: INSTAGRAM_ID,
  overwatch2: OVERWATCH_ID,
  splatoon3: SPLATOON_ID,
  valorant: VALORANT_ID,
  tekken: TEKKEN_ID,
  marvelrivals: MARVELRIVALS_ID,
  counterstrike2: COUNTERSTRIKE_ID,
  streetfighter: STREETFIGHTER_ID,
  fortnite: FORTNITE_ID,
  smashultimate: SMASH_ID,
  leagueoflegends: LEAGUEOFLEGENDS_ID,
  rainbowsixsiege: RAINBOWSIXSIEGE_ID,
  rocketleague: ROCKETLEAGUE_ID
};


app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // true if using HTTPS
  })
);

// 1. Login route: redirect to Facebook OAuth
app.get("/auth/facebook", (req, res) => {
  const fbAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${INSTAGRAM_REDIRECT_URI}&scope=instagram_basic&response_type=code`;
  res.redirect(fbAuthUrl);
});

app.get("/auth/instagram/callback", async (req, res) => {
  const { code } = req.query;

  // Ensure the code exists
  if (!code) {
    return res.status(400).send("No code received. Start from /auth/facebook first.");
  }

  try {
    const tokenResponse = await axios.get(
      "https://graph.facebook.com/v19.0/oauth/access_token",
      {
        params: {
          client_id: APP_ID,
          client_secret: APP_SECRET,
          redirect_uri: INSTAGRAM_REDIRECT_URI,
          code,
        },
      }
    );

    const access_token = tokenResponse.data.access_token;
    req.session.access_token = access_token;
    //redirect can be removed once we're done here
    res.redirect("/account/success");
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Failed to exchange code for token");
  }
});


app.get("/account/:name", async (req, res) =>
{
  const name = req.params.name;
  const IG_ID = accounts[name];
  if (!IG_ID) return res.status(404).send("Account not found");
  const token = req.session.access_token;
  const now = Date.now();

  if (cacheMap[IG_ID] && now - cacheMap[IG_ID].lastFetch < CACHE_DURATION) {
    return res.json(cacheMap[IG_ID].data);
  }

   try {
    // Fetch account media
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/${IG_ID}?fields=id,username,media.limit(50){id,caption,media_type,media_url,timestamp}&access_token=${token}`
    );

    // Fetch insights for media
    response.data.media.data = await fetchMediaWithInsights(response.data.media.data, token);

    // Cache the result
    cacheMap[IG_ID] = {
      data: { message: "Login successful!", instagram: response.data },
      lastFetch: now
    };

    console.log(cacheMap[IG_ID].data);

    return res.json(cacheMap[IG_ID].data);

  } catch (err) {
    console.error("Error fetching Instagram data:", err.response?.data || err.message);
    return res.status(500).send("Failed to fetch Instagram data");
  }

});


//function to get insights in each app.get
async function fetchMediaWithInsights(mediaArray, token) {
  //const recentMedia = mediaArray.filter(m => compareDate(m.timestamp))
  const recentMedia = mediaArray;

  return await Promise.all(
    recentMedia.map(async (media) => {
      try {
        const insightsResponse = await axios.get(
          `https://graph.facebook.com/v19.0/${media.id}/insights?metric=likes,comments,shares,total_interactions,views,reposts&access_token=${token}`
        );
        media.insights = {};
        for (let metric of insightsResponse.data.data) {
          media.insights[metric.name] = metric.values[0].value;
        }
      } catch (err) {
        console.error("Error fetching Instagram data:", err.response?.data || err.message);
      }
      return media;
    })
  );
}


async function fetchWeeklyData(IG_ID, token){
    try{
      const response = await axios.get(
      `https://graph.facebook.com/v19.0/${IG_ID}?fields=id,username,media.limit(50){id,caption,media_type,media_url,timestamp}&access_token=${token}`
    );

      let mediaArray = response.data.media?.data || [];

      const pastWeekMedia = mediaArray.filter((post) => SinceSunday(post.timestamp));

      const pastWeekWithInsights = await fetchMediaWithInsights(pastWeekMedia, token);
      return pastWeekWithInsights;

    } catch(err){
      console.error("Error feching Instagram media:", err.response?.data || err.message);
      return [];
    }
}

app.get("/account/weekly/all", async (req, res) => {
  const token = req.session.access_token;

  try{
    const results = {};

    for(const[name, IG_ID] of Object.entries(accounts)){
      const media = await fetchWeeklyData(IG_ID, token);
      results[name] = media;
    }

    res.json({ message: "Fetched past week for all accounts", data: results });

  } catch(err){
    console.error("Error fetching past week for all accounts:", err.message);
    res.status(500).send("Failed to fetch data");
  }

});



function SinceSunday(post_date)
{
  const sunday = new Date();
  sunday.setDate(sunday.getDate()-sunday.getDay());
  const post = new Date(post_date);
  sunday.setHours(0, 0, 0, 0);
  if(post > sunday){return true;}
  return false;
}

// Starts server. Go to http://localhost:3000/auth/facebook to log in and give access code.
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));