import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { useEffect, useState } from "react";
import { AppBar, Toolbar, List, Grid, Chip, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { getGenreArtists, getArtistAlbums } from "../../services/ApiSpotify";

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
  const [contractGenres, setContractGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [artists, setArtists] = useState<any[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<any | null>(null);
  const [albums, setAlbums] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (selectedDj && selectedDj.selectedGenres) {
      setContractGenres(selectedDj.selectedGenres);
    }
  }, [selectedDj]);

  const handleGenreSelect = async (genre: string) => {
    setSelectedGenre(genre);
    setSelectedArtist(null);
    setAlbums([]);
    setSearchTerm(""); // Limpiar el término de búsqueda al cambiar de género

    try {
      const genreArtists = await getGenreArtists(genre);
      setArtists(genreArtists);
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
            <Card>
              <CardContent>
                <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
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
                      />
                      <Grid container spacing={2}>
                        {artists
                          .filter((artist) =>
                            artist.name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          )
                          .slice(0, 4)
                          .map((artist, index) => (
                            <Grid item key={index} xs={12} sm={6} md={3}>
                              <Card sx={{ maxWidth: 345 }}>
                                <CardMedia
                                  component="img"
                                  height="194"
                                  image={
                                    artist.imageUrl || "/default-image.jpg"
                                  } // Ajusta según tus datos reales
                                  alt={artist.name}
                                />
                                <CardContent>
                                  <Typography variant="h5">
                                    {artist.name}
                                  </Typography>
                                </CardContent>
                                <CardActions disableSpacing>
                                  <IconButton aria-label="add to favorites">
                                    <FavoriteIcon />
                                  </IconButton>
                                  <IconButton aria-label="share">
                                    <ShareIcon />
                                  </IconButton>
                                  <IconButton
                                    aria-label="show more"
                                    onClick={() => handleArtistSelect(artist)}
                                  >
                                    <ExpandMoreIcon />
                                  </IconButton>
                                </CardActions>
                              </Card>
                            </Grid>
                          ))}
                      </Grid>
                    </div>
                  )}
                </CardContent>
                {selectedArtist && (
                  <Card>
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        sx={{ textAlign: "center" }}
                      >
                        Artista Seleccionado: {selectedArtist.name}
                      </Typography>
                      {albums.length > 0 && (
                        <div>
                          <Typography variant="subtitle1">
                            Álbumes del Artista:
                          </Typography>
                          <ul>
                            {albums.map((album, index) => (
                              <li key={index}>{album.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </Card>
            </Grid>
          )}

          {selectedArtist && (
            <Grid item xs={12} sm={6} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
                    Artista Seleccionado: {selectedArtist.name}
                  </Typography>
                  {albums.length > 0 && (
                    <div>
                      <Typography variant="subtitle1">
                        Álbumes del Artista:
                      </Typography>
                      <ul>
                        {albums.map((album, index) => (
                          <li key={index}>{album.name}</li>
                        ))}
                      </ul>
                    </div>
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
