import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {
  Button,
  AppBar,
  Toolbar,
  List,
  Grid,
  Chip,
  Avatar,
  TextField,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getGenreArtists,
  getArtistAlbums,
  getAlbumTracks,
} from "../../services/ApiSpotify";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AlbumIcon from "@mui/icons-material/Album";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const ContractConfiguration: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDj = location.state?.selectedDj;

  const [contractGenres, setContractGenres] = React.useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = React.useState<string | null>(null);
  const [artists, setArtists] = React.useState<any[]>([]);
  const [selectedArtist, setSelectedArtist] = React.useState<any | null>(null);
  const [albums, setAlbums] = React.useState<any[]>([]);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  const [selectedAlbum, setSelectedAlbum] = React.useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedAlbumTracks, setSelectedAlbumTracks] = React.useState<any[]>(
    []
  );
  const [loadingArtists, setLoadingArtists] = React.useState(false);
  const [loadingAlbums, setLoadingAlbums] = React.useState(false);

  const handleExpandClick = (index: number) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleAlbumSelect = async (album: any) => {
    setSelectedAlbum(album);

    try {
      const albumTracks = await getAlbumTracks(album.id);
      setSelectedAlbumTracks(albumTracks);
      setDialogOpen(true);
    } catch (error) {
      console.error(`Error al obtener pistas del álbum ${album.name}:`, error);
    }
  };

  React.useEffect(() => {
    if (selectedDj && selectedDj.selectedGenres) {
      setContractGenres(selectedDj.selectedGenres);
    }
  }, [selectedDj]);

  const handleGenreSelect = async (genre: string) => {
    setSelectedGenre(genre);
    setSelectedArtist(null);
    setSearchTerm("");
    setAlbums([]);

    try {
      setLoadingArtists(true);
      const genreArtists = await getGenreArtists(genre);
      setLoadingArtists(false);

      const uniqueNewArtists = genreArtists.filter(
        (newArtist) =>
          !artists.some((existingArtist) => existingArtist.id === newArtist.id)
      );

      if (uniqueNewArtists.length > 0) {
        setArtists(uniqueNewArtists);
      }
    } catch (error) {
      setLoadingArtists(false);
      console.error(`Error al obtener artistas del género ${genre}:`, error);
    }
  };

  const handleArtistSelect = async (artist: any) => {
    setSelectedArtist(artist);

    console.log("Información del artista:", artist);

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

  if (!selectedDj) {
    return <div>Selecciona un DJ para ver los detalles del contrato.</div>;
  }

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
                alt={`Avatar de ${selectedDj.userFirstName} ${selectedDj.userLastName}`}
                src={selectedDj.customAvatarUrl}
                sx={{
                  borderRadius: "5px",
                  height: 60,
                  width: 100,
                  marginRight: 2,
                }}
              />
              <Typography variant="h5">{`${selectedDj.userFirstName} ${selectedDj.userLastName}`}</Typography>
            </Grid>
            <Grid container item justifyContent="flex-end" xs={6}>
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
      <List>
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
                  {contractGenres.map((genre, genreIndex) => (
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
                {loadingArtists && (
                  <div style={{ textAlign: "center", marginTop: 20 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ marginTop: 1 }}>
                      Cargando artistas...
                    </Typography>
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid>
          {selectedGenre && (
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
                  {artists.length > 0 && (
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
                              <li>
                                <Card
                                  sx={{
                                    maxWidth: 345,
                                    margin: "10px",
                                    height: "110%",
                                    display: "flex",
                                    flexDirection: "column",
                                    boxShadow:
                                      "0 10px 18px rgba(255, 255, 255, 0.7)",
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
                                    image={
                                      artist.imageUrl ||
                                      "/static/images/default-artist-image.jpg"
                                    }
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
                                      ALBUNES
                                    </Typography>
                                  </CardContent>
                                  <CardActions disableSpacing>
                                    <IconButton
                                      aria-label="add to favorites"
                                      sx={{ mt: -5 }}
                                    >
                                      <FavoriteIcon
                                        sx={{ fontSize: "2.5rem" }}
                                      />
                                    </IconButton>

                                    <ExpandMore
                                      expand={expandedIndex === index}
                                      onClick={() => handleExpandClick(index)}
                                      aria-expanded={expandedIndex === index}
                                      aria-label="show more"
                                      sx={{ mt: -5 }}
                                    >
                                      <AlbumIcon
                                        sx={{ fontSize: "3rem" }}
                                        onClick={() =>
                                          handleArtistSelect(artist)
                                        }
                                      />
                                    </ExpandMore>
                                  </CardActions>
                                </Card>
                              </li>
                            </Grid>
                          ))}
                      </Grid>
                    </div>
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

                      <Grid
                        container
                        spacing={2}
                        sx={{ marginLeft: "-25px", padding: 3 }}
                      >
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
                                  boxShadow:
                                    "0 20px 40px rgba(255, 255, 255, 0.7)",
                                },
                              }}
                            >
                              <CardMedia
                                component="img"
                                height="140"
                                image={
                                  album.images[0]?.url ||
                                  "/path/to/default-image.jpg"
                                }
                                alt={album.name}
                                sx={{
                                  width: "100%",
                                  borderTopLeftRadius: "5px",
                                  borderTopRightRadius: "5px",
                                }}
                              />
                              <CardContent>
                                <Typography
                                  variant="subtitle1"
                                  sx={{ fontWeight: "bold" }}
                                >
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
                    <Dialog
                      open={dialogOpen}
                      onClose={() => setDialogOpen(false)}
                      fullWidth
                      maxWidth="md"
                      PaperProps={{
                        style: {
                          position: "fixed",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                        },
                      }}
                    >
                      <DialogTitle>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={
                              selectedAlbum.images[0]?.url ||
                              "/path/to/default-image.jpg"
                            }
                            alt={selectedAlbum.name}
                            style={{
                              width: "50px",
                              height: "50px",
                              marginRight: "10px",
                            }}
                          />
                          {`Pistas del Álbum: ${selectedAlbum.name}`}
                        </div>
                      </DialogTitle>
                      <DialogContent>
                        <ul>
                          {selectedAlbumTracks.map((track, index) => (
                            <li key={index}>{track.name}</li>
                          ))}
                        </ul>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => setDialogOpen(false)}>
                          Cerrar
                        </Button>
                      </DialogActions>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </List>
    </div>
  );
};

export default ContractConfiguration;
