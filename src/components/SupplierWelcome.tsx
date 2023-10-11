import { useEffect, useState } from "react"; // Importa useEffect y useState desde React
import { useDispatch, useSelector } from "react-redux";
import { setSelectedGenres } from "../redux/reducers/RegisteredFormSlice";
import { RootState } from "../model/RootStateTypes";
import { getAvailableGenres } from "../services/ApiSpotify";
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
import SuppliersHome from "../../public/images/SuppliersHome.jpg";
import logomusic from "../../public/images/Logomusic.png";
import Navbar from "../components/NavbarSuppliers";

const SupplierWelcome = () => {
  const dispatch = useDispatch();
  const [genres, setGenres] = useState<string[]>([]);
  const [showWelcomeSnackbar, setShowWelcomeSnackbar] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const user = useSelector((state: RootState) => state.userLogin.user);
  const userEmail = user?.userEmail;

  const selectedGenres = useSelector(
    (state: RootState) =>
      state.registered.DjsUsers.find((user) => user.userEmail === userEmail)
        ?.selectedGenres || []
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

  return (
    <Grid
      container
      item
      xs={12}
      sm={12}
      md={12}
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <div
        style={{
          backgroundImage: `url(${SuppliersHome})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          zIndex: -1,
        }}
      ></div>
      <Grid container item xs={12} sm={12} md={12}>
        <Navbar />
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        sx={{
          mt: -1,
          background: "rgba(0, 0, 0, 0.9)",
          height: 50,
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontSize: 30,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          ELECCION DE GENEROS
        </Typography>
      </Grid>
      <Typography
        sx={{
          mt: -1,
          background: "rgba(0, 0, 0, 0.7)",
          color: "white",
          fontSize: -30,
          fontWeight: "600",
          width: "100%",
          textAlign: "center",
        }}
      >
        "Crea tu identidad musical seleccionando entre una variedad de géneros
        disponibles en Music World. Destácate en tus áreas de experiencia o
        explora nuevos territorios artísticos. Tu elección define tu viaje
        musical único. ¡Descubre, experimenta y encuentra tu estilo en el mundo
        de la música!"
      </Typography>

      {showWelcomeSnackbar && (
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          container
          style={{
            position: "relative",
            marginTop: "2rem",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <Snackbar
            open={showWelcomeSnackbar}
            autoHideDuration={3000}
            onClose={() => setShowWelcomeSnackbar(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <SnackbarContent
              style={{
                height: "100%",
                background: "rgba(0, 0, 0, 1)",
                color: "white",
                textAlign: "center",
                padding: "20px",
              }}
              message={
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  container
                  style={{ position: "relative", marginTop: "10px" }}
                >
                  <Grid>
                    <Typography
                      variant="h4"
                      style={{
                        marginBottom: "1rem",
                        marginLeft: "60px",
                      }}
                    >
                      ¡Bienvenido!
                    </Typography>
                    <Typography
                      variant="h4"
                      style={{ marginBottom: "1rem", marginLeft: "80px" }}
                    >
                      {user?.userFirstName}!
                    </Typography>
                  </Grid>

                  <img
                    src={logomusic}
                    alt="Logo"
                    style={{
                      borderRadius: "10px",
                      marginLeft: "65px",
                      maxWidth: "200px",
                      marginBottom: "1rem",
                    }}
                  />
                  <Typography variant="body1" style={{ padding: " 10px" }}>
                    Descubre la plataforma de música exclusiva para proveedores.
                    Aquí podrás encontrar todas las herramientas y recursos que
                    necesitas para potenciar tu negocio musical.
                  </Typography>
                </Grid>
              }
            />
          </Snackbar>
        </Grid>
      )}

      <Grid container spacing={5} item xs={12} sm={12} md={12}>
        <Grid item xs={4}>
          <Card
            variant="outlined"
            sx={{
              marginRight: -3,
              marginLeft: "1px",
              height: "100%",
              background: "rgba(0, 0, 0, 0.4)",
              color: "white",
              textAlign: "center",
            }}
          >
            <CardContent>
              <Typography variant="h5" mb={2}>
                Mis Géneros
              </Typography>

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

        <Grid item xs={8} sm={8} md={8}>
          <Card
            variant="outlined"
            sx={{
              marginRight: -5,
              marginLeft: 5,
              background: "rgba(0, 0, 0, 0.4)",
              color: "white",
              textAlign: "center",
              mt: 5,
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
                  maxHeight: "300px",
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
    </Grid>
  );
};

export default SupplierWelcome;
