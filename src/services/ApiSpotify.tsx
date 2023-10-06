import axios from "axios";

const SPOTIFY_API_URL = "https://accounts.spotify.com/api/token";
const GENRE_API_URL =
  "https://api.spotify.com/v1/recommendations/available-genre-seeds";

const CLIENT_ID = "dd9eb2be272945c8bc5a8d34c3fbe76a";
const CLIENT_SECRET = "b1fbd0950c3c437aa838b77ffdc8431e";

const getClientCredentialsToken = async () => {
  try {
    const response = await axios.post(SPOTIFY_API_URL, null, {
      params: {
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      },
    });

    // Token de acceso
    return response.data.access_token;
  } catch (error) {
    console.error("Error al obtener el token de acceso de Spotify:", error);
    throw error;
  }
};

export const getAvailableGenres = async () => {
  try {
    const accessToken = await getClientCredentialsToken();

    const response = await axios.get(GENRE_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // Lista de géneros musicales
    return response.data.genres;
  } catch (error) {
    console.error("Error al obtener los géneros musicales de Spotify:", error);
    throw error;
  }
};


