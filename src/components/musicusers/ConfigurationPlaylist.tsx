import React, { useState, useEffect } from "react";
import {
  Button,
  AppBar,
  Toolbar,
  Grid,
  Chip,
  Avatar,
  TextField,
  Paper,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Slider,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AlbumIcon from "@mui/icons-material/Album";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ReactPlayer from "react-player";
import logomusic from "/images/Logomusic.png";
import {
  getAlbumTracks,
  getArtistAlbums,
  getGenreArtists,
} from "../../services/ApiSpotify";
import {
  addSelectedSong,
  removeSelectedSong,
} from "../../redux/reducers/ContractSlice";
import { RootState } from "../../model/RootStateTypes";
import { useDispatch, useSelector } from "react-redux";

const ContractDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const contractId = location.state && location.state.ContractId;
  const contracts = useSelector((state: RootState) => state.contract.contracts);

  const [contractDetails, setContractDetails] = useState<any | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [artists, setArtists] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [selectedArtist, setSelectedArtist] = React.useState<any | null>(null);
  const [albums, setAlbums] = React.useState<any[]>([]);
  const [loadingAlbums, setLoadingAlbums] = React.useState(false);
  const [selectedAlbum, setSelectedAlbum] = React.useState<any | null>(null);
  const [selectedSongs, setSelectedSongs] = React.useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [loadingArtists, setLoadingArtists] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentSong, setCurrentSong] = React.useState<any | null>(null);
  const [songVolumes, setSongVolumes] = React.useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    if (selectedAlbum) {
      const fetchAlbumTracks = async () => {
        try {
          setLoadingAlbums(true);
          const albumTracks = await getAlbumTracks(selectedAlbum.id);

          // Obtener las canciones seleccionadas del estado de Redux
          const selectedSongsFromState =
            contracts.find((contract) => contract.ContractId === contractId)
              ?.selectedSongs || [];

          // Marcar las canciones seleccionadas previamente
          const updatedAlbumTracks = albumTracks.map((track: any) => {
            const isSongSelected = selectedSongsFromState.some(
              (selectedSong: any) => selectedSong.id === track.id
            );

            return {
              ...track,
              isSongSelected,
            };
          });

          setSelectedSongs(updatedAlbumTracks);
          setLoadingAlbums(false);
        } catch (error) {
          setLoadingAlbums(false);
          console.error(
            `Error al obtener pistas del álbum ${selectedAlbum.name}:`,
            error
          );
        }
      };

      fetchAlbumTracks();
    }
  }, [selectedAlbum, contracts, contractId]);

  useEffect(() => {
    if (contractId) {
      const selectedContract = contracts.find(
        (contract) => contract.ContractId === contractId
      );

      if (selectedContract) {
        setContractDetails(selectedContract.contract);
      } else {
        console.log(
          "No se encontró un contrato para el ID de contrato seleccionado."
        );
        navigate("/contratos");
      }
    }
  }, [contracts, contractId, navigate]);

  const handleGenreSelect = async (genre: string) => {
    setSelectedGenre(genre);
    setSelectedArtist(null);
    setSearchTerm("");
    setAlbums([]);

    try {
      setLoadingArtists(true);
      const genreArtists = await getGenreArtists(genre);
      setLoadingArtists(false);
      setArtists(genreArtists);
    } catch (error) {
      console.error(`Error al obtener artistas del género ${genre}:`, error);
    }
  };

  const handleArtistSelect = async (artist: any) => {
    setSelectedArtist(artist);

    try {
      setLoadingAlbums(true);
      const artistAlbums = await getArtistAlbums(artist.id);
      setLoadingAlbums(false);
      setAlbums(artistAlbums);
    } catch (error) {
      setLoadingAlbums(false);
      console.error(
        `Error al obtener álbumes del artista ${artist.name}:`,
        error
      );
    }
  };

  const handleAlbumSelect = async (album: any) => {
    setSelectedAlbum(album);

    try {
      const albumTracks = await getAlbumTracks(album.id);
      setSelectedSongs(
        albumTracks.map((track: any) => ({ ...track, isSongSelected: false }))
      );
      setDialogOpen(true);
    } catch (error) {
      console.error(`Error al obtener pistas del álbum ${album.name}:`, error);
    }
  };

  const handleSongSelect = (selectedSong: any) => {
    const updatedSongs = selectedSongs.map((song) =>
      song.id === selectedSong.id
        ? { ...song, isSongSelected: !song.isSongSelected }
        : song
    );

    setSelectedSongs(updatedSongs);

    if (selectedSong.isSongSelected) {
      dispatch(removeSelectedSong({ selectedSong, contractId }));
    } else {
      dispatch(addSelectedSong({ selectedSong, contractId }));
    }
  };

  const handlePlay = (song: any) => {
    setIsPlaying(true);
    setCurrentSong(song);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleVolumeChange = (
    _event: Event,
    newValue: number | number[],
    songId: string
  ) => {
    setSongVolumes((prevVolumes) => ({
      ...prevVolumes,
      [songId]: newValue as number,
    }));
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedSongs([]);
  };

  useEffect(() => {
    // Actualizamos el estado local de las canciones al abrir el diálogo
    if (dialogOpen) {
      const selectedSongsFromState =
        contracts.find((contract) => contract.ContractId === contractId)
          ?.selectedSongs || [];
      const updatedAlbumTracks = selectedSongs.map((track: any) => {
        const isSongSelected = selectedSongsFromState.some(
          (selectedSong: any) => selectedSong.id === track.id
        );

        return {
          ...track,
          isSongSelected,
        };
      });

      setSelectedSongs(updatedAlbumTracks);
    }
  }, [dialogOpen, contracts, contractId]);

  if (!contractDetails) {
    return <div>No se encontraron detalles del contrato.</div>;
  }

  const { DjImg, DjFirstName, DjLastName, DjGenres } = contractDetails.djInfo;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.7)",
        color: "white",
        overflow: "auto",
      }}
    >
      <AppBar position="static" color="transparent">
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            background: "rgba(0, 0, 0, 0.9)",
            fontWeight: "bold",
          }}
        >
          Dj Seleccionado
        </Typography>
        <Toolbar>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            sx={{ paddingLeft: "20px", paddingRight: "20px" }}
          >
            <Grid container item alignItems="center" xs={6}>
              <Avatar
                alt={`Avatar de ${DjFirstName} ${DjLastName}`}
                src={DjImg}
                sx={{
                  borderRadius: "5px",
                  height: 60,
                  width: 100,
                  marginRight: 2,
                }}
              />
              <Typography variant="h5">{`${DjFirstName} ${DjLastName}`}</Typography>
            </Grid>
            <Grid container item justifyContent="flex-end" xs={6}>
              <Button
                onClick={() => navigate("/listcontracts")}
                variant="outlined"
                color="primary"
                sx={{
                  mr: 5,
                  height: 40,
                  backgroundColor: "rgba(0, 128, 255, 0.6)",
                  color: "white",
                  borderColor: "black",
                }}
                startIcon={<ArrowBackIcon />}
              >
                Atrás
              </Button>
              <Button
                onClick={() => navigate("/userwelcome")}
                variant="contained"
                color="secondary"
                style={{ width: "200px" }}
              >
                Salir
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {DjGenres && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12}>
            <Card
              sx={{
                background: "rgba(0, 0, 0, 0.7)",
                color: "white",
                fontSize: -30,
                fontWeight: "600",
                width: "100%",
                textAlign: "center",
                mt: "1px",
              }}
            >
              <CardContent>
                <Typography
                  variant="subtitle1"
                  sx={{
                    textAlign: "center",
                    marginBottom: 2,
                    letterSpacing: 1,
                  }}
                >
                  Géneros del DJ:
                </Typography>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "5px",
                    flexWrap: "wrap",
                  }}
                >
                  {DjGenres.map((genre: string, genreIndex: number) => (
                    <Chip
                      key={genreIndex}
                      label={genre}
                      variant="outlined"
                      onClick={() => handleGenreSelect(genre)}
                      sx={{
                        fontStyle: "italic",
                        background: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        fontSize: -30,
                        fontWeight: "600",
                        textAlign: "center",
                        letterSpacing: 2,
                        mt: "1px",
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      {loadingArtists && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ marginTop: 1 }}>
            Cargando artistas...
          </Typography>
        </div>
      )}
      {selectedGenre && artists.length > 0 && (
        <Grid item xs={12} sm={12} md={12}>
          <Card
            sx={{
              background: "rgba(0, 0, 0, 0.7)",
              color: "white",
              mt: "-13px",
            }}
          >
            <CardContent>
              <Typography
                sx={{
                  mt: -2,
                  fontSize: 40,
                  textAlign: "center",
                  fontWeight: "bold",
                  fontStyle: "italic",
                }}
              >
                {selectedGenre}
              </Typography>
              <div>
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontStyle: "italic",
                  }}
                >
                  Busca Tu Artista Preferido
                </Typography>
                <TextField
                  variant="filled"
                  label="Buscar artista..."
                  name="EventHours"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                  autoComplete="off"
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "white",
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                />
                <Grid
                  container
                  spacing={4}
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  justifyContent="center"
                >
                  {artists
                    .filter((artist) =>
                      artist.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .slice(0, 4)
                    .map((artist, index) => (
                      <Grid item key={index} xs={12} sm={6} md={3}>
                        <li style={{ listStyle: "none" }}>
                          <Card
                            sx={{
                              maxWidth: 345,
                              margin: "10px",
                              height: "110%",
                              display: "flex",
                              flexDirection: "column",
                              boxShadow: "0 10px 18px rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            <CardHeader
                              sx={{ textAlign: "center" }}
                              title={artist.name}
                              subheader={`Género: ${selectedGenre}`}
                              style={{ height: 50 }}
                            />
                            <CardMedia
                              component="img"
                              height="250px"
                              image={artist.imageUrl || logomusic}
                              alt={artist.name}
                            />
                            <CardContent>
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  textAlign: "center",
                                  fontSize: 13,
                                  mr: -26,
                                  mt: -1,
                                }}
                              >
                                ALBUMES
                              </Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                              <IconButton
                                aria-label="add to favorites"
                                sx={{ mt: -5 }}
                              >
                                <FavoriteIcon sx={{ fontSize: "2.5rem" }} />
                              </IconButton>

                              <IconButton
                                onClick={() => {
                                  handleArtistSelect(artist);
                                }}
                                aria-label="show more"
                                sx={{ mt: -5 }}
                              >
                                <AlbumIcon sx={{ fontSize: "3rem" }} />
                              </IconButton>
                            </CardActions>
                          </Card>
                        </li>
                      </Grid>
                    ))}
                </Grid>
              </div>
            </CardContent>
          </Card>
        </Grid>
      )}

      {loadingAlbums && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ marginTop: 1 }}>
            Cargando álbumes...
          </Typography>
        </div>
      )}
      {selectedArtist && (
        <div>
          <Typography
            variant="h6"
            sx={{
              fontSize: 30,
              textAlign: "center",
              mt: 2,
              mb: 2,
              fontWeight: "bold",
              fontStyle: "italic",
            }}
          >
            Álbunes De {selectedArtist.name}
          </Typography>

          <Grid container spacing={2} sx={{ marginLeft: "-25px", padding: 3 }}>
            {albums.map((album, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={2}>
                <Card
                  onClick={() => handleAlbumSelect(album)}
                  sx={{
                    cursor: "pointer",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    background: "rgba(0, 0, 0, 1)",
                    color: "white",
                    transition: "transform 0.4s, box-shadow 0.4s",
                    margin: "10px",
                    "&:hover": {
                      transform: "scale(1.3)",
                      boxShadow: "0 20px 40px rgba(255, 255, 255, 0.7)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={album.images[0]?.url || "/path/to/default-image.jpg"}
                    alt={album.name}
                    sx={{
                      width: "100%",
                      borderTopLeftRadius: "5px",
                      borderTopRightRadius: "5px",
                    }}
                  />
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {album.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontStyle: "italic", fontSize: 10 }}
                    >
                      Tipo de Álbum: {album.album_type}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontStyle: "italic", fontSize: 10 }}
                    >
                      Número total de pistas: {album.total_tracks}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontStyle: "italic", fontSize: 10 }}
                    >
                      Fecha de lanzamiento: {album.release_date} (
                      {album.release_date_precision})
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontStyle: "italic", fontSize: 10 }}
                    >
                      Artistas:{" "}
                      {album.artists
                        .map((artist: { name: any }) => artist.name)
                        .join(", ")}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      )}

      {selectedAlbum && (
        <Grid>
          <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
              style: {
                background: "rgba(0, 0, 0, 0.9)",
                color: "white",
                marginTop: -10,
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                height: "100%",
                marginLeft: "auto",
                marginRight: "auto",
              },
            }}
          >
            <DialogTitle>
              <Typography
                style={{
                  fontSize: 25,
                  textAlign: "center",
                  marginTop: -1,
                  marginBottom: -15,
                  fontWeight: "bold",
                  fontStyle: "italic",
                }}
              >
                {`Pistas del Álbum: ${selectedAlbum.name}`}
              </Typography>
            </DialogTitle>
            <DialogContent
              style={{
                height: "100%",
                overflowY: "auto",
                backgroundImage: `url(${
                  selectedAlbum.images[0]?.url || "/path/to/default-image.jpg"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                margin: "20px",
              }}
            >
              <Grid
                style={{
                  listStyle: "none",
                  padding: 0,
                }}
              >
                {selectedSongs.map((track, index) => (
                  <li key={index} style={{ margin: "5px" }}>
                    <Paper
                      style={{
                        background: "rgba(0, 0, 0, 0.8)",
                        borderRadius: "5px",
                        padding: "5px",
                      }}
                    >
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={3}>
                          <IconButton
                            onClick={() => handleSongSelect(track)}
                            color="primary"
                            aria-label="Agregar a lista de reproducción"
                            sx={{
                              ml: 2,
                              height: "auto",
                              width: "auto",
                              backgroundColor: "black",
                            }}
                          >
                            {track.isSongSelected ? (
                              <PlaylistAddCheckIcon
                                sx={{
                                  fontSize: "2.2rem",
                                  color: "currentcolor",
                                }}
                              />
                            ) : (
                              <PlaylistAddIcon
                                sx={{ fontSize: "2.2rem", color: "violet" }}
                              />
                            )}
                          </IconButton>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="body1"
                            style={{
                              fontSize: 20,
                              textAlign: "center",
                              marginTop: -20,
                              marginBottom: -15,
                              fontWeight: "lighter",
                              fontStyle: "italic",
                              color: "white",
                            }}
                          >
                            {track.name} -{" "}
                            {track.artists
                              .map((artist: any) => artist.name)
                              .join(", ")}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          {track.preview_url ? (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <IconButton
                                  onClick={() =>
                                    currentSong && isPlaying
                                      ? handlePause()
                                      : handlePlay(track)
                                  }
                                  color="primary"
                                  aria-label="Agregar a lista de reproducción"
                                  sx={{
                                    mr: 1,
                                    ml: -2,
                                    height: "auto",
                                    width: "auto",
                                    backgroundColor: "black",
                                  }}
                                >
                                  {currentSong &&
                                  isPlaying &&
                                  currentSong.id === track.id ? (
                                    <PauseCircleIcon
                                      sx={{
                                        fontSize: "2.2rem",
                                        color: "currentcolor",
                                      }}
                                    />
                                  ) : (
                                    <PlayCircleIcon
                                      sx={{
                                        fontSize: "2.2rem",
                                        color: "violet",
                                      }}
                                    />
                                  )}
                                </IconButton>
                                <ReactPlayer
                                  url={track.preview_url}
                                  playing={
                                    isPlaying && currentSong?.id === track.id
                                  }
                                  volume={songVolumes[track.id] || 0.1}
                                  width="0"
                                  height="0"
                                />
                                <Slider
                                  value={songVolumes[track.id] || 0.1}
                                  min={0}
                                  max={1}
                                  step={0.01}
                                  onChange={(_event, newValue) =>
                                    handleVolumeChange(
                                      _event,
                                      newValue,
                                      track.id
                                    )
                                  }
                                  style={{
                                    width: "100%",
                                    marginRight: 10,
                                    marginLeft: 10,
                                  }}
                                />
                              </div>
                            </>
                          ) : (
                            <Typography
                              variant="body1"
                              style={{
                                fontSize: 14,
                                textAlign: "center",
                                color: "red",
                                marginLeft: "auto",
                                marginRight: "10px",
                              }}
                            >
                              No disponible
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </Paper>
                  </li>
                ))}
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button
                onClick={() => setDialogOpen(false)}
                variant="contained"
                color="secondary"
                style={{ width: "200px" }}
              >
                Cerrar
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      )}
    </div>
  );
};

export default ContractDetailsPage;
