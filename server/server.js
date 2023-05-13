import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import cors from 'cors';
import lyricsFinder from 'lyrics-finder';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//this is an api that we'll call from our react app.
app.post('/login', (req, res) => {
  const code = req.body.code;

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
  });

  spotifyApi.authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in
      })
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(400);
    })
});

app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
    refreshToken,
  });

  spotifyApi.refreshAccessToken()
    .then(data => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in
      })
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(400);
    })
})

app.get('/lyrics', async (req, res) => {
  const lyrics = await lyricsFinder(req.query.artist, req.query.track) || 'no lyrics found';
  res.json({ lyrics });
});


app.listen(PORT, err =>
  err ? console.error(err) : console.log(`app started on port ${PORT}`)
);