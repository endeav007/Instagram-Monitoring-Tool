const axios = require('axios');
const dotenv = require('dotenv');
const session = require('express-session');

dotenv.config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; //will set to port 3000, OR the users port
const { APP_ID, APP_SECRET, INSTAGRAM_REDIRECT_URI, SESSION_SECRET, INSTAGRAM_ID, OVERWATCH_ID, SPLATOON_ID, VALORANT_ID, TEKKEN_ID, 
  MARVELRIVALS_ID, COUNTERSTRIKE_ID, STREETFIGHTER_ID, FORTNITE_ID, SMASH_ID, LEAGUEOFLEGENDS_ID, RAINBOWSIXSIEGE_ID, ROCKETLEAGUE_ID} = process.env;


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
    res.redirect("/success");
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Failed to exchange code for token");
  }
});


//success will be the main page

app.get("/success", async (req, res) => {
  const token = req.session.access_token;
  const IG_ID = INSTAGRAM_ID;
  try
  {
    const response = await axios.get(
    `https://graph.facebook.com/v19.0/${IG_ID}?fields=id,username,media{id,caption,media_type,media_url,timestamp}&access_token=${token}`
    );

    response.data.media.data = await fetchMediaWithInsights(response.data.media.data, token);
    console.log("Instagram data:", response.data.media.data[0]);
    res.json({
      message: "Login successful!",
      instagram: response.data
    });
      
  } catch (err) {
    console.error("Error fetching Instagram data:", err.response?.data || err.message);
    res.status(500).send("Failed to fetch Instagram data");
  }
});

app.get("/overwatch2", async (req, res) => {
  const token = req.session.access_token;
  const IG_ID = OVERWATCH_ID;
  try{
    const response = await axios.get(
    `https://graph.facebook.com/v19.0/${IG_ID}?fields=id,username,media{id,caption,media_type,media_url,timestamp}&access_token=${token}`
    );

    response.data.media.data = await fetchMediaWithInsights(response.data.media.data, token);
    console.log("Instagram data:", response.data.media.data[0]);
    res.json({
      message: "Login successful!",
      instagram: response.data
    });

  } catch(err){
    console.error("Error fetching Instagram data:", err.response?.data || err.message);
    res.status(500).send("Failed to fetch Instagram data");
  }

});

app.get("/splatoon3", async (req, res) => {
  const token = req.session.access_token;
  const IG_ID = SPLATOON_ID;
  try{
    const response = await axios.get(
    `https://graph.facebook.com/v19.0/${IG_ID}?fields=id,username,media{id,caption,media_type,media_url,timestamp}&access_token=${token}`
    );

    response.data.media.data = await fetchMediaWithInsights(response.data.media.data, token);
    console.log("Instagram data:", response.data.media.data[0]);
    res.json({
      message: "Login successful!",
      instagram: response.data
    });

  } catch(err){
    console.error("Error fetching Instagram data:", err.response?.data || err.message);
    res.status(500).send("Failed to fetch Instagram data");
  }

});

app.get("/valorant", async (req, res) => {
  const token = req.session.access_token;
  const IG_ID = VALORANT_ID;
  try{
    const response = await axios.get(
    `https://graph.facebook.com/v19.0/${IG_ID}?fields=id,username,media{id,caption,media_type,media_url,timestamp}&access_token=${token}`
    );
    response.data.media.data = await fetchMediaWithInsights(response.data.media.data, token);

    console.log("Instagram data:", response.data.media.data[0]);
    res.json({
      message: "Login successful!",
      instagram: response.data
    });

  } catch(err){
    console.error("Error fetching Instagram data:", err.response?.data || err.message);
    res.status(500).send("Failed to fetch Instagram data");
  }

});

app.get("/tekken", async (req, res) => {
  const token = req.session.access_token;
  const IG_ID = TEKKEN_ID;
  try{
    const response = await axios.get(
    `https://graph.facebook.com/v19.0/${IG_ID}?fields=id,username,media{id,caption,media_type,media_url,timestamp}&access_token=${token}`
    );

    response.data.media.data = await fetchMediaWithInsights(response.data.media.data, token);
    console.log("Instagram data:", response.data.media.data[0]);
    res.json({
      message: "yuh",
      instagram: response.data
    });

  } catch(err){
    console.error("Error fetching Instagram data:", err.response?.data || err.message);
    res.status(500).send("Failed to fetch Instagram data");
  }

});

app.get("/marvelrivals", async (req, res) => {
  const token = req.session.access_token;
  const IG_ID = MARVELRIVALS_ID;
  try{
    const response = await axios.get(
    `https://graph.facebook.com/v19.0/${IG_ID}?fields=id,username,media{id,caption,media_type,media_url,timestamp}&access_token=${token}`
    );

    response.data.media.data = await fetchMediaWithInsights(response.data.media.data, token);

    console.log("Instagram data:", response.data.media.data[0]);
    res.json({
      message: "Login successful!",
      instagram: response.data
    });

  } catch(err){
    console.error("Error fetching Instagram data:", err.response?.data || err.message);
    res.status(500).send("Failed to fetch Instagram data");
  }

});

app.get("/counterstrike2", async (req, res) => {
  const token = req.session.access_token;
  const IG_ID = COUNTERSTRIKE_ID;
  try{
    const response = await axios.get(
    `https://graph.facebook.com/v19.0/${IG_ID}?fields=id,username,media{id,caption,media_type,media_url,timestamp}&access_token=${token}`
    );

    response.data.media.data = await fetchMediaWithInsights(response.data.media.data, token);
    console.log("Instagram data:", response.data.media.data[0]);
    res.json({
      message: "yuh",
      instagram: response.data
    });

  } catch(err){
    console.error("Error fetching Instagram data:", err.response?.data || err.message);
    res.status(500).send("Failed to fetch Instagram data");
  }

});

app.get("/streetfighter", async (req, res) => {
  const token = req.session.access_token;
  const IG_ID = STREETFIGHTER_ID;
  try{
    const response = await axios.get(
    `https://graph.facebook.com/v19.0/${IG_ID}?fields=id,username,media{id,caption,media_type,media_url,timestamp}&access_token=${token}`
    );

    response.data.media.data = await fetchMediaWithInsights(response.data.media.data, token);
    console.log("Instagram data:", response.data.media.data[0]);
    res.json({
      message: "yuh",
      instagram: response.data
    });

  } catch(err){
    console.error("Error fetching Instagram data:", err.response?.data || err.message);
    res.status(500).send("Failed to fetch Instagram data");
  }

});

app.get("/fortnite", async (req, res) => {
  const token = req.session.access_token;
  const IG_ID = FORTNITE_ID;
  try{
    const response = await axios.get(
    `https://graph.facebook.com/v19.0/${IG_ID}?fields=id,username,media{id,caption,media_type,media_url,timestamp}&access_token=${token}`
    );

    response.data.media.data = await fetchMediaWithInsights(response.data.media.data, token);
    console.log("Instagram data:", response.data.media.data[0]);
    res.json({
      message: "yuh",
      instagram: response.data
    });

  } catch(err){
    console.error("Error fetching Instagram data:", err.response?.data || err.message);
    res.status(500).send("Failed to fetch Instagram data");
  }

});

app.get("/smashultimate", async (req, res) => {
  const token = req.session.access_token;
  const IG_ID = SMASH_ID;
  try{
    const response = await axios.get(
    `https://graph.facebook.com/v19.0/${IG_ID}?fields=id,username,media{id,caption,media_type,media_url,timestamp}&access_token=${token}`
    );

    response.data.media.data = await fetchMediaWithInsights(response.data.media.data, token);
    console.log("Instagram data:", response.data.media.data[0]);
    res.json({
      message: "yuh",
      instagram: response.data
    });

  } catch(err){
    console.error("Error fetching Instagram data:", err.response?.data || err.message);
    res.status(500).send("Failed to fetch Instagram data");
  }

});

app.get("/leagueoflegends", async (req, res) => {
  const token = req.session.access_token;
  const IG_ID = LEAGUEOFLEGENDS_ID;
  try{
    const response = await axios.get(
    `https://graph.facebook.com/v19.0/${IG_ID}?fields=id,username,media{id,caption,media_type,media_url,timestamp}&access_token=${token}`
    );

    response.data.media.data = await fetchMediaWithInsights(response.data.media.data, token);

    console.log("Instagram data:", response.data.media.data[0]);
    res.json({
      message: "yuh",
      instagram: response.data
    });

  } catch(err){
    console.error("Error fetching Instagram data:", err.response?.data || err.message);
    res.status(500).send("Failed to fetch Instagram data");
  }

});

app.get("/rainbowsixsiege", async (req, res) => {
  const token = req.session.access_token;
  const IG_ID = RAINBOWSIXSIEGE_ID;
  try{
    const response = await axios.get(
    `https://graph.facebook.com/v19.0/${IG_ID}?fields=id,username,media{id,caption,media_type,media_url,timestamp}&access_token=${token}`
    );

    response.data.media.data = await fetchMediaWithInsights(response.data.media.data, token);
    console.log("Instagram data:", response.data.media.data[0]);
    res.json({
      message: "yuh",
      instagram: response.data
    });

  } catch(err){
    console.error("Error fetching Instagram data:", err.response?.data || err.message);
    res.status(500).send("Failed to fetch Instagram data");
  }

});

app.get("/rocketleague", async (req, res) => {
  const token = req.session.access_token;
  const IG_ID = ROCKETLEAGUE_ID;
  try{
    const response = await axios.get(
    `https://graph.facebook.com/v19.0/${IG_ID}?fields=id,username,media{id,caption,media_type,media_url,timestamp}&access_token=${token}`
    );

    response.data.media.data = await fetchMediaWithInsights(response.data.media.data, token);
    console.log("Instagram data:", response.data.media.data[0]);
    res.json({
      message: "yuh",
      instagram: response.data
    });

  } catch(err){
    console.error("Error fetching Instagram data:", err.response?.data || err.message);
    res.status(500).send("Failed to fetch Instagram data");
  }

});

//function to get insights in each app.get
async function fetchMediaWithInsights(mediaArray, token) {
  return await Promise.all(
    mediaArray.map(async (media) => {
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


// Starts server. Go to http://localhost:3000/auth/facebook to log in and give access code.
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));