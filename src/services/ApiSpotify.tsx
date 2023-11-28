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
    return response.data.genres;
  } catch (error) {
    console.error("Error al obtener los géneros musicales de Spotify:", error);
    throw error;
  }
};

export const getGenreArtists = async (genre: string) => {
  try {
    const accessToken = await getClientCredentialsToken();

    // Parámetros de paginación
    const limit = 100; // Número máximo de resultados por página
    let offset = 0; // Índice de la página (inicia en 0)

    const uniqueArtistsSet = new Set(); // Conjunto para realizar un seguimiento de artistas únicos
    const allArtists = [];

    // Realizar solicitudes hasta que se obtengan todos los resultados
    while (true) {
      const genreArtistsURL = `https://api.spotify.com/v1/recommendations?seed_genres=${genre}&limit=${limit}&offset=${offset}`;
      console.log("URL de solicitud para artistas:", genreArtistsURL);

      const response = await axios.get(genreArtistsURL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Respuesta de la solicitud para artistas:", response.data);

      // Lista de artistas del género con imágenes y IDs
      const artistsWithImages = response.data.tracks.map(async (track: any) => {
        const artist = track.artists[0];
        const artistName = artist.name;

        // Verificar si el artista ya está en el conjunto de artistas únicos
        if (!uniqueArtistsSet.has(artist.id)) {
          // Agregar el ID del artista al conjunto
          uniqueArtistsSet.add(artist.id);

          // Obtener detalles del artista, incluyendo imágenes
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

          console.log(`Imagen para ${artistName}: ${imageUrl}`);

          return {
            id: artist.id,
            name: artistName,
            imageUrl: imageUrl,
          };
        }

        return null; // Retorna null para los artistas duplicados
      });

      // Esperar a que todas las solicitudes asincrónicas se completen
      const resolvedArtists = (await Promise.all(artistsWithImages)).filter(
        (artist) => artist !== null
      );

      // Agregar los artistas de la página actual a la lista completa
      allArtists.push(...resolvedArtists);

      // Verificar si hay más resultados
      if (response.data.next) {
        offset += limit; // Incrementar el índice de la página
      } else {
        break; // No hay más resultados, salir del bucle
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

// En el archivo ApiSpotify.js

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

// En el archivo ApiSpotify.js

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

