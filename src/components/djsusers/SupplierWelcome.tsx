import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedGenres } from "../../redux/reducers/RegisteredFormSlice";
import { setShowWelcomeMessage } from "../../redux/reducers/UserLoginSlice";
import { RootState } from "../../model/RootStateTypes";
import { getAvailableGenres } from "../../services/ApiSpotify";
import {
  Snackbar,
  SnackbarContent,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
} from "@mui/material";
import { useSnackbar } from "notistack";
import SuppliersHome from "/images/SuppliersHome.jpg";
import logomusic from "/images/Logomusic.png";
import Navbar from "./NavbarSuppliers";

const SupplierWelcome = () => {
  const dispatch = useDispatch();
  const [genres, setGenres] = useState<string[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  const user = useSelector((state: RootState) => state.userLogin.user);
  const userEmail = user?.userEmail;

  const selectedGenres = useSelector(
    (state: RootState) =>
      state.registered.DjsUsers.find((user) => user.userEmail === userEmail)
        ?.selectedGenres || []
  );

  const hasShownWelcomeMessage = useSelector(
    (state: RootState) => state.userLogin.hasShownWelcomeMessage
  );

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData: string[] = await getAvailableGenres();
        setGenres(genresData);
      } catch (error) {
        console.error("Error al obtener los géneros musicales:", error);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreClick = (genre: string) => {
    const isGenreSelected = selectedGenres.includes(genre);

    if (isGenreSelected) {
      const updatedGenres = selectedGenres.filter((g: string) => g !== genre);
      dispatch(setSelectedGenres({ email: userEmail, genres: updatedGenres }));

      enqueueSnackbar(`Género ${genre} eliminado de MIS GENEROS`, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        style: { backgroundColor: "black" },
      });
    } else {
      dispatch(
        setSelectedGenres({
          email: userEmail,
          genres: [...selectedGenres, genre],
        })
      );

      enqueueSnackbar(`Género ${genre} agregado a MIS GENEROS`, {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left",
        },
        style: { backgroundColor: "black" },
      });
    }
  };

  const handleCloseWelcomeSnackbar = () => {
    dispatch(setShowWelcomeMessage(false));
  };

  return (
    <Grid
      container
      item
      xs={12}
      sm={12}
      md={12}
      style={{
        marginTop: -7,
        height: "auto",
        width: "100vw",
        backgroundImage: `url(${SuppliersHome})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div>
        <Navbar />

        <Typography
          sx={{
            backgroundColor: "black",
            color: "white",
            fontSize: 30,
            fontWeight: "600",
            textAlign: "center",
            mt: "1px",
          }}
        >
          ELECCION DE GENEROS
        </Typography>

        <Typography
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
          "Crea tu identidad musical seleccionando entre una variedad de géneros
          disponibles en Music World. Destácate en tus áreas de experiencia o
          explora nuevos territorios artísticos. Tu elección define tu viaje
          musical único. ¡Descubre, experimenta y encuentra tu estilo en el
          mundo de la música!"
        </Typography>

        {hasShownWelcomeMessage && (
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            container
            style={{
              position: "relative",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <Snackbar
              open={hasShownWelcomeMessage}
              autoHideDuration={3000}
              onClose={handleCloseWelcomeSnackbar}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <SnackbarContent
                style={{
                  background: "rgba(0, 0, 0, 1)",
                  color: "white",
                  textAlign: "center",

                  width: "100%",
                  maxWidth: "auto",
                }}
                message={
                  <Grid
                    container
                    direction="column"
                    alignItems="center"
                    spacing={2}
                  >
                    <Grid item>
                      <Typography variant="h4">¡Bienvenid@!</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h4">
                        {user?.userFirstName}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h4">
                        Ya eres Dj de Music-World
                      </Typography>
                    </Grid>
                    <Grid item>
                      <img
                        src={logomusic}
                        alt="Logo"
                        style={{
                          borderRadius: "10px",
                          maxWidth: "200px",
                          marginTop: "1rem",
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant="body1">
                        Descubre la plataforma de música exclusiva para
                        proveedores. Aquí podrás encontrar todas las
                        herramientas y recursos que necesitas para potenciar tu
                        negocio musical.
                      </Typography>
                    </Grid>
                  </Grid>
                }
              />
            </Snackbar>
          </Grid>
        )}

        <Grid container spacing={-8} item xs={12} sm={12} md={12}>
          <Grid item xs={4} sm={4} md={4}>
            <Card
              variant="outlined"
              sx={{
                mt: "1px",
                ml: 1,
                width: "105%",
                height: "476px",
                background: "rgba(0, 0, 0, 0.4)",
                color: "white",
                textAlign: "center",
              }}
            >
              <CardContent>
                <Typography variant="h5">Mis Géneros</Typography>
                {selectedGenres.map((genre: string) => (
                  <Chip
                    key={genre}
                    label={genre}
                    color="primary"
                    style={{ margin: 5 }}
                    onClick={() => handleGenreClick(genre)}
                  />
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid container item xs={8} sm={8} md={8}>
            <Card
              variant="outlined"
              sx={{
                mt: "1px",
                height: "476px",
                marginRight: -7,
                marginLeft: 5,
                background: "rgba(0, 0, 0, 0.4)",
                color: "white",
                textAlign: "center",
              }}
            >
              <CardContent>
                <Typography variant="h5" style={{ marginBottom: 10 }}>
                  Elige tus Géneros
                </Typography>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    height: "350px",
                    overflowY: "auto",
                    background: "rgba(0, 0, 0, 0.4)",
                  }}
                >
                  {genres.map((genre) => (
                    <Chip
                      sx={{ color: "white" }}
                      key={genre}
                      label={genre}
                      color={
                        selectedGenres.includes(genre) ? "primary" : "default"
                      }
                      onClick={() => handleGenreClick(genre)}
                      style={{ cursor: "pointer", margin: 5 }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
};

export default SupplierWelcome;
