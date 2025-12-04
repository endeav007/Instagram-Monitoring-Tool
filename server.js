const axios = require('axios');
const dotenv = require('dotenv');
const session = require('express-session');

dotenv.config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; //will set to port 3000, OR the users port
const { APP_ID, APP_SECRET, INSTAGRAM_REDIRECT_URI, SESSION_SECRET, INSTAGRAM_ID, OVERWATCH_ID, SPLATOON_ID, SPREADSHEET_ID } = process.env;

//app.use(express.static(path.resolve(__dirname, '../client/build')));
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
    //console.log("Access token received:", access_token);

    // 33. Redirect user to a success page
    // Optionally, store token in session or database instead of passing in URL
    res.redirect("/success");
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Failed to exchange code for token");
  }
});


app.get("/success", async (req, res) => {
  const token = req.session.access_token;
  //res.send(`Login successful!`);
  const IG_ID = INSTAGRAM_ID;
  const OW_ID = OVERWATCH_ID;
  const SP_ID = SPLATOON_ID; 
try
{
  //try if else statement here to get response, and redirect
  const response = await axios.get(
  `https://graph.facebook.com/v19.0/${IG_ID}?fields=id,username,media{id,caption,media_type,media_url,timestamp,like_count,embed}&access_token=${token}`
  );

  console.log("Instagram data:", response.data.media.data[0]);

  /*
  response.data.media.data.forEach(element => {
    appendRow(element);
  });
  */

  //appendRow(response.data.media.data[0]);
  // Send response *after* the async operations finish
  res.json({
    message: "Login successful!",
    instagram: response.data
  });
    
} catch (err) {
  console.error("Error fetching Instagram data:", err.response?.data || err.message);
  res.status(500).send("Failed to fetch Instagram data");
}
});

//not sure about this reponse, just sent things to the thml
/*
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
*/

// Starts server. Go to http://localhost:3000/auth/facebook to log in and give access code.
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));