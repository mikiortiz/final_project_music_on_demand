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
    console.log('Géneros disponibles:', response.data.genres);
    return response.data.genres;
  } catch (error) {
    console.error("Error al obtener los géneros musicales de Spotify:", error);
    throw error;
  }
};

export const getGenreArtists = async (genre: string) => {
  try {
    const accessToken = await getClientCredentialsToken();

    const limit = 100;
    let offset = 0;
    let hasNextPage = true;

    const uniqueArtistsSet = new Set();
    const allArtists = [];

    while (hasNextPage) {
      const genreArtistsURL = `https://api.spotify.com/v1/recommendations?seed_genres=${genre}&limit=${limit}&offset=${offset}`;

      const response = await axios.get(genreArtistsURL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const artistsWithImages = response.data.tracks.map(async (track: any) => {
        const artist = track.artists[0];
        const artistName = artist.name;

        if (!uniqueArtistsSet.has(artist.id)) {
          uniqueArtistsSet.add(artist.id);

          const artistDetailsResponse = await axios.get(
            `https://api.spotify.com/v1/artists/${artist.id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const artistDetails = artistDetailsResponse.data;
          const images = artistDetails.images;
          const imageUrl = images && images.length > 0 ? images[0].url : null;

          return {
            id: artist.id,
            name: artistName,
            imageUrl: imageUrl,
          };
        }

        return null;
      });

      const resolvedArtists = (await Promise.all(artistsWithImages)).filter(
        (artist) => artist !== null
      );

      allArtists.push(...resolvedArtists);

      // Ahora se verifica si hay más resultados
      hasNextPage = response.data.next ? true : false;
      if (hasNextPage) {
        offset += limit;
      }
    }

    return allArtists;
  } catch (error) {
    console.error(
      `Error al obtener artistas del género ${genre} de Spotify:`,
      error
    );
    throw error;
  }
};

export const getArtistAlbums = async (artistId: string) => {
  try {
    const accessToken = await getClientCredentialsToken();

    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}/albums`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.items;
  } catch (error) {
    console.error(`Error al obtener álbumes del artista ${artistId}:`, error);
    throw error;
  }
};

export const getAlbumTracks = async (albumId: string) => {
  try {
    const accessToken = await getClientCredentialsToken();

    const response = await axios.get(
      `https://api.spotify.com/v1/albums/${albumId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.items;
  } catch (error) {
    console.error(`Error al obtener pistas del álbum ${albumId}:`, error);
    throw error;
  }
};
