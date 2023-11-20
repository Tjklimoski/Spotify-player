import { useEffect, useState, useRef } from "react";
import axios from "axios";

//this code makes API calls to our server, which in turn calls the spotify API and sends us back the data from it.

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();
  const usedCode = useRef(null);

  useEffect(() => {
    //prevent dupilicate request being made to Spotify API with same code
    if (code === usedCode.current) return;
    usedCode.current = code;

    axios
      .post(`${import.meta.env.VITE_API_ORIGIN}login`, {
        code,
      })
      .then(res => {
        //set the state variables with the values sent back by the API
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
        //modify the user's URL to remove the code param sent in the url
        window.history.pushState({}, null, "/");
      })
      .catch(() => {
        //if the code has already expired and we can't authenticate user
        //this will redirect the user back to logging in again
        window.location = "/";
      });
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      axios
        .post(`${import.meta.env.VITE_API_ORIGIN}refresh`, {
          refreshToken,
        })
        .then(res => {
          //set the state variables with the values sent back by the API
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
        })
        .catch(() => {
          //this will redirect the user back to logging in again if any errors
          window.location = "/";
        });

      return () => {
        clearInterval(interval);
      };
    }, (expiresIn - 60) * 1000);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
