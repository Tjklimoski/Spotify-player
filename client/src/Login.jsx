import React from 'react';
import qs from 'qs';

const SPOTIFY_ENDPOINT = "https://accounts.spotify.com/authorize?"

const SPOTIFY_QUERY = {
  client_id: "c1632634c2b2457cb93a760c789aaef4",
  response_type: "code",
  redirect_uri: "http://localhost:5173/",
  scope:
    "streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state",
};

const AUTH_URL = SPOTIFY_ENDPOINT + qs.stringify(SPOTIFY_QUERY);

export default function Login() {
  return <a className="btn" href={AUTH_URL}>Login with Spotify</a>
}
