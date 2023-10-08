import { useEffect, useState } from "react"; // Importa useEffect y useState desde React
import { useDispatch, useSelector } from "react-redux";
import { setSelectedGenres } from "../redux/reducers/RegisteredFormSlice";
import { logoutUser } from "../redux/reducers/UserLoginSlice"; // Importa la acción logoutUser
import { RootState } from "../redux/model/RootStateTypes";
import { getAvailableGenres } from "../services/ApiSpotify";
import {
  Snackbar,
  SnackbarContent,
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Container,
  Avatar,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import SuppliersHome from "../../public/images/SuppliersHome.jpg";
import logomusic from "../../public/images/Logomusic.png";

const SupplierWelcome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <div
      style={{
        position: "relative",
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
      <Box
        sx={{
          background: "rgba(0, 0, 0, 0.9)",
          height: 50,
          textAlign: "center",
        }}
      >
        <Typography sx={{ color: "white", fontSize: 30, fontWeight: "600" }}>
          ELECCION DE GENEROS
        </Typography>
      </Box>
      <Typography
        sx={{
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
      <div
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        {showWelcomeSnackbar && (
          <Snackbar
            open={showWelcomeSnackbar}
            autoHideDuration={2000}
            onClose={() => setShowWelcomeSnackbar(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <SnackbarContent
              style={{
                background: "rgba(0, 0, 0, 1)",
                color: "white",
                textAlign: "center",
                padding: "20px",
              }}
              message={
                <div style={{ position: "relative", marginTop: "40px" }}>
                  <Typography variant="h4" style={{ marginBottom: "20px" }}>
                    ¡Bienvenido, {user?.userFirstName}!
                  </Typography>
                  <img
                    src={logomusic}
                    alt="Logo"
                    style={{
                      borderRadius: "10px",
                      width: "200px",
                      margin: "0 auto",
                      marginBottom: "20px",
                    }}
                  />
                  <Typography variant="body1">
                    Descubre la plataforma de música exclusiva para proveedores.
                    Aquí podrás encontrar todas las herramientas y recursos que
                    necesitas para potenciar tu negocio musical.
                  </Typography>
                </div>
              }
            />
          </Snackbar>
        )}
        <AppBar
          position="static"
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            height: "70px",
          }}
        >
          <Toolbar>
            {user && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "auto",
                }}
              >
                <Avatar
                  src={user.customAvatarUrl}
                  alt="User Avatar"
                  style={{
                    marginLeft: "80px",
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    marginRight: 10,
                  }}
                />
                <div>
                  <Typography
                    variant="subtitle1"
                    style={{ color: "#fff", fontWeight: "bold" }}
                  >
                    {user.userFirstName}
                  </Typography>
                  <Typography variant="body2" style={{ color: "#fff" }}>
                    {user.userEmail}
                  </Typography>
                </div>
              </div>
            )}
            {user && (
              <div style={{ marginLeft: "auto", marginRight: 10 }}>
                {/* Utiliza el componente Button para el botón de cierre de sesión */}
                <Button
                  variant="contained"
                  onClick={handleLogout}
                  color="secondary"
                >
                  Cerrar Sesión
                </Button>
              </div>
            )}
          </Toolbar>
        </AppBar>
        <Container style={{ marginTop: 50 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Card
                variant="outlined"
                sx={{
                  marginLeft: -6,
                  height: "100%",
                  background: "rgba(0, 0, 0, 0.4)",
                  color: "white",
                  textAlign: "center",
                }}
              >
                <CardContent>
                  <Typography variant="h5" style={{ marginBottom: 10 }}>
                    Mis Géneros
                  </Typography>
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {selectedGenres.map((genre: string) => (
                      <Chip
                        key={genre}
                        label={genre}
                        color="primary"
                        style={{ margin: 5 }}
                        onClick={() => handleGenreClick(genre)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={8}>
              <Card
                variant="outlined"
                sx={{
                  marginRight: -3,
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
        </Container>
      </div>
    </div>
  );
};

export default SupplierWelcome;
