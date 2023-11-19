import dotenv from "dotenv";
dotenv.config();
import express from "express";
import SpotifyWebApi from "spotify-web-api-node";
import cors from "cors";
import Genius from "genius-lyrics";
const lyricsClient = new Genius.Client();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
  res.send("Hello World");
});

//this is an api that we'll call from our react app.
app.post("/login", (req, res) => {
  const code = req.body.code;

  // build spotifyWebApi
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(400);
    });
});

// API route to handle refreshing the access token sent from spotify
app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then(data => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(400);
    });
});

app.get("/lyrics", async (req, res) => {
  // Search Genuis for the song the user is playing
  const results = await lyricsClient.songs.search(req.query.track);

  // Select the first results from the list
  const song = results.filter(song => song.artist.name === req.query.artist)[0];

  // Get the lyrics
  const lyrics = (await song?.lyrics()) || "No lyrics found";
  res.json({ lyrics });
});

app.listen(PORT, err =>
  err ? console.error(err) : console.log(`app started on port ${PORT}`)
);
