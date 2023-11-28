import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
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
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getGenreArtists,
  getArtistAlbums,
  getAlbumTracks,
} from "../../services/ApiSpotify";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

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
    setAlbums([]);
    setSearchTerm("");

    try {
      const genreArtists = await getGenreArtists(genre);

      // Filtrar artistas existentes para evitar duplicados
      const uniqueNewArtists = genreArtists.filter(
        (newArtist) =>
          !artists.some((existingArtist) => existingArtist.id === newArtist.id)
      );

      // Actualizar el estado solo con los nuevos artistas del género
      if (uniqueNewArtists.length > 0) {
        setArtists(uniqueNewArtists);
      }
    } catch (error) {
      console.error(`Error al obtener artistas del género ${genre}:`, error);
    }
  };

  const handleArtistSelect = async (artist: any) => {
    setSelectedArtist(artist);

    try {
      const artistAlbums = await getArtistAlbums(artist.id);
      setAlbums(artistAlbums);
    } catch (error) {
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
          {selectedGenre && (
            <Grid item xs={12} sm={12} md={12}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
                    Género Seleccionado: {selectedGenre}
                  </Typography>
                  {artists.length > 0 && (
                    <div>
                      <Typography variant="subtitle1">
                        Artistas del Género:
                      </Typography>
                      <input
                        type="text"
                        placeholder="Buscar artistas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px",
                          boxSizing: "border-box",
                          marginBottom: "10px",
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
                              <li onClick={() => handleArtistSelect(artist)}>
                                <Card
                                  sx={{
                                    maxWidth: 345,
                                    margin: "10px",
                                    height: "110%", // Agrega esta línea para establecer la misma altura
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                  onClick={() => handleArtistSelect(artist)}
                                >
                                  <CardHeader
                                    sx={{ textAlign: "center" }}
                                    title={artist.name}
                                    subheader={`Género: ${selectedGenre}`}
                                  />
                                  <CardMedia
                                    component="img"
                                    height="194"
                                    image={
                                      artist.imageUrl ||
                                      "/static/images/default-artist-image.jpg"
                                    }
                                    alt={artist.name}
                                  />
                                  <CardContent>
                                    <Typography
                                      variant="subtitle1"
                                      sx={{ textAlign: "center", fontSize: 13 }}
                                    >
                                      en esta seccion podras dar me gusta al
                                      artista y seleccionar albunes y canciones
                                    </Typography>
                                  </CardContent>
                                  <CardActions disableSpacing>
                                    <IconButton aria-label="add to favorites">
                                      <FavoriteIcon />
                                    </IconButton>
                                    <IconButton aria-label="share">
                                      <ShareIcon />
                                    </IconButton>
                                    <ExpandMore
                                      expand={expandedIndex === index}
                                      onClick={() => handleExpandClick(index)}
                                      aria-expanded={expandedIndex === index}
                                      aria-label="show more"
                                    >
                                      <ExpandMoreIcon />
                                    </ExpandMore>
                                  </CardActions>
                                  <Collapse
                                    in={expandedIndex === index}
                                    timeout="auto"
                                    unmountOnExit
                                  >
                                    <CardContent>
                                      {selectedArtist &&
                                        selectedArtist.id === artist.id && (
                                          <div>
                                            <Typography variant="subtitle1">
                                              Álbumes del Artista:
                                            </Typography>
                                            <ul>
                                              {albums.map((album, index) => (
                                                <Button
                                                  key={index}
                                                  onClick={() =>
                                                    handleAlbumSelect(album)
                                                  }
                                                  sx={{
                                                    width: "118%",
                                                    ml: -5,
                                                    mt: 1,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                    padding: "10px",
                                                    borderRadius: "5px",
                                                    background:
                                                      "rgba(0, 0, 0, 0.7)",
                                                    color: "black",
                                                  }}
                                                >
                                                  <img
                                                    src={
                                                      album.images[0]?.url ||
                                                      "/path/to/default-image.jpg"
                                                    }
                                                    alt={album.name}
                                                    style={{
                                                      width: "50px",
                                                      height: "50px",
                                                      borderRadius: "5px",
                                                    }}
                                                  />
                                                  <span style={{ flex: 1 }}>
                                                    {album.name}
                                                  </span>
                                                </Button>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                    </CardContent>
                                  </Collapse>
                                </Card>
                              </li>
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
