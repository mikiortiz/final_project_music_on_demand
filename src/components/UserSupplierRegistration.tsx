import { useState } from "react";
import fondo from "../../public/images/Fondo.png";
import {
  Button,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Typography,
  FormControl,
} from "@mui/material";
import CardImage from "../../public/images/CardImageSupplier.png";
import { Box } from "@mui/system";
import logomusic from "../../public/images/Logomusic.png";
import { useDispatch, useSelector} from "react-redux";
import  RootState  from "../redux/model/RootStateTypes";
import { addSupplier } from "../redux/reducers/RegisteredFormSlice";
import Avatar from "@mui/material/Avatar";
import { fetchRandomUserData } from "../services/ApiUsers";
import UserRegistrationForm from "./UserRegistrationForm";
import LoginForm from "./LoginForm";

const UserSupplierRegistration = () => {
  const [showUserForm, setShowUserForm] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userAge, setUserAge] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [genderPreference, setGenderPreference] = useState("");
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [userContactNumber, setUserContactNumber] = useState("");
  const [cardText, setCardText] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogBackgroundColor, setDialogBackgroundColor] = useState("white");
  const [dialogTextColor, setDialogTextColor] = useState("black");

  const [showLoginForm, setShowLoginForm] = useState(false);

  const dispatch = useDispatch();

  const musicalGenres = [
    "Pop",
    "Rock",
    "Electrónica",
    "Hip-Hop",
    "Jazz",
    "Clásica",
    "R&B",
    "Reggae",
    "Country",
    "Metal",
    "cumbia",
  ];

  const registeredSuppliers = useSelector(
    (state: RootState) => state.registered.Suppliers
  );
  const registeredUsers = useSelector(
    (state: RootState) => state.registered.MusicUser
  );

  const isSupplierAdult = () => {
    return parseInt(userAge) >= 18;
  };
  const isValidAvatarURL = (url: string) => {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(url);
  };

  const handleProveedorClick = async () => {
    setShowCard(true);

    const userData = await fetchRandomUserData();
    if (userData) {
      setUserEmail(userData.email);
      setUserFirstName(userData.name.first);
      setUserLastName(userData.name.last);
      setUserAge(userData.dob.age);
      setUserContactNumber(userData.cell);
      setCustomAvatarUrl(userData.picture.large);
    }
  };

  const handleUsuarioClick = () => {
    setShowCard(false);
    setShowUserForm(true);
  };

  const handleCloseClick = () => {
    setShowCard(false);
    setShowUserForm(false);
  };

  const handleSubmitFormSuppliers = () => {
    const isPasswordUsed =
      (registeredSuppliers &&
        registeredSuppliers.some(
          (supplier: { userPassword: string }) =>
            supplier.userPassword === userPassword
        )) ||
      (registeredUsers &&
        registeredUsers.some(
          (user: { userPassword: string }) => user.userPassword === userPassword
        ));

    if (isPasswordUsed) {
      setDialogTitle("Error de Registro");
      setCardText("Esta contraseña ya existe, ingrese otra contraseña.");
      setOpenDialog(true);
      return;
    }

    if (
      userEmail &&
      userAge &&
      userPassword &&
      genderPreference &&
      customAvatarUrl
    ) {
      if (!isSupplierAdult()) {
        setDialogTitle("Error de Registro");
        setCardText("Debes ser Mayor de 18 Años para Registrarte.");
        setOpenDialog(true);
        return;
      }

      if (userFirstName === "") {
        setDialogTitle("Error de Registro");
        setCardText("Nombre por Favor");
        setOpenDialog(true);
        return;
      }

      if (userLastName === "") {
        setDialogTitle("Error de Registro");
        setCardText("Apellido por Favor");
        setOpenDialog(true);
        return;
      }

      if (userContactNumber === "" || userContactNumber.length < 6) {
        setDialogTitle("Error de Registro");
        setCardText("Numero de Contacto Valido por Favor");
        setOpenDialog(true);
        return;
      }

      if (userPassword.length < 4) {
        setDialogTitle("Error de Registro");
        setCardText("La Contraseña Debe Tener al Menos 4 Caracteres");
        setOpenDialog(true);
        return;
      }

      if (!userEmail.includes("@")) {
        setDialogTitle("Error de Registro");
        setCardText("Dirección de Correo Electrónico Invalido.");
        setOpenDialog(true);
        return;
      }

      if (!isValidAvatarURL(customAvatarUrl)) {
        setDialogTitle("Error de Registro");
        setCardText(
          "La URL de la imagen de avatar no tiene un formato válido."
        );
        setOpenDialog(true);
        return;
      }

      const newSupplier = {
        userEmail,
        userFirstName,
        userLastName,
        userAge,
        userPassword,
        genderPreference,
        customAvatarUrl,
        userContactNumber,
      };

      dispatch(addSupplier(newSupplier));

      setUserEmail("");
      setUserFirstName("");
      setUserLastName("");
      setUserAge("");
      setUserPassword("");
      setGenderPreference("");
      setCustomAvatarUrl("");
      setUserContactNumber("");
      setCardText("Registrado éxitosamente");

      setDialogTitle("Éxito");
      setDialogBackgroundColor("green");
      setDialogTextColor("white");
      setOpenDialog(true);
    } else {
      setDialogTitle("Error");
      setCardText("Por favor, completa todos los campos obligatorios.");
      setOpenDialog(true);
    }
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);

    if (dialogTitle === "Éxito") {
      setShowUserForm(false);
      setShowCard(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      <img
        src={logomusic}
        alt="Logomusic"
        style={{
          borderRadius: "10px",
          position: "absolute",
          top: "20px",
          width: "200px",
        }}
      />

      <Box
        sx={{
          borderRadius: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          width: "90%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "5%",
          maxWidth: "500px",
          margin: "0 auto",
          position: "absolute",
          top: "67%",
          transform: "translateY(-50%)",
        }}
      >
        <Button
          onClick={() => setShowLoginForm(true)}
          variant="outlined"
          color="primary"
          fullWidth
          sx={{
            height: 50,
            mt: -5,
            mb: 2,
            backgroundColor: "rgba(0, 128, 255, 0.5)",
            color: "white",
            borderColor: "black",
            minWidth: "300px",
          }}
        >
          Login
        </Button>
        {showLoginForm && <LoginForm onClose={() => setShowLoginForm(false)} />}

        <Typography variant="h4" color="white">
          Te Regístraras como
        </Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <Button
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              color: "white",
              borderColor: "black",
              minWidth: "300px",
              width: "auto",
              height: "60px",
              whiteSpace: "nowrap",
            }}
            variant="outlined"
            onClick={handleProveedorClick}
          >
            Music-DJ-World
          </Button>

          <Button
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              color: "white",
              borderColor: "black",
              minWidth: "300px",
              width: "auto",
              height: "60px",
              whiteSpace: "nowrap",
            }}
            variant="outlined"
            onClick={handleUsuarioClick}
          >
            Music-Usuario-World
          </Button>
        </div>
        <Typography
          variant="caption"
          color="white"
          style={{
            width: "auto",
            marginTop: 5,
            fontSize: "1.2rem",
            marginBottom: -60,
            textAlign: "center",
            lineHeight: "1.2",
          }}
        >
          En World Music, nuestro "Music-DJ-World" es tu maestro de ceremonias
          musical, y nuestros "Music-Usuario-World" son los oyentes más
          exigentes. Escucha la diferencia con nosotros.
        </Typography>
      </Box>
      {showCard && (
        <div
          style={{
            borderRadius: "20px",
            color: "white",
            position: "fixed",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "90%",
            height: "95%",
            margin: "auto",
            boxShadow: "0px 0px 100px rgba(0, 0, 0, 1 )",
          }}
        >
          <Box
            sx={{
              backgroundImage: `url(${CardImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              height: "90%",
              width: "90%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              padding: "1rem",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <FormControl
              fullWidth
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "1rem",
              }}
            >
              <div style={{ flex: 1 }}>
                <Typography sx={{ color: "white", mt: 2 }}>Nombre</Typography>
                <TextField
                  placeholder="Nombre"
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                  sx={{ bgcolor: "Window" }}
                  value={userFirstName}
                  onChange={(e) => setUserFirstName(e.target.value)}
                  autoComplete="off"
                />

                <Typography sx={{ color: "white", mt: 1 }}>Apellido</Typography>
                <TextField
                  placeholder="Apellido"
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                  sx={{ bgcolor: "Window" }}
                  value={userLastName}
                  onChange={(e) => setUserLastName(e.target.value)}
                  autoComplete="off"
                />

                <Typography sx={{ color: "white", mt: 1 }}>Edad</Typography>
                <TextField
                  placeholder="Edad"
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                  sx={{ bgcolor: "Window" }}
                  value={userAge}
                  onChange={(e) => setUserAge(e.target.value)}
                  autoComplete="off"
                />

                <Typography sx={{ color: "white", mt: 1 }}>
                  Numero de Contacto
                </Typography>
                <TextField
                  placeholder="Número de Contacto"
                  fullWidth
                  variant="outlined"
                  size="small"
                  required
                  sx={{ bgcolor: "Window" }}
                  value={userContactNumber}
                  onChange={(e) => setUserContactNumber(e.target.value)}
                  autoComplete="off"
                />

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    borderRadius: "5px",
                    marginTop: "30px",
                    height: "200px",
                  }}
                >
                  <Typography
                    variant="h5"
                    component="div"
                    align="center"
                    color="white"
                    marginTop={"90px"}
                    marginRight={"40px"}
                  >
                    Tu Avatar
                  </Typography>
                  <Avatar
                    alt="Avatar"
                    src={customAvatarUrl}
                    sx={{
                      width: 150,
                      height: 150,
                      marginTop: "25px",
                    }}
                  />
                </div>
              </div>

              <div style={{ flex: 1, marginTop: "32px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    marginTop: "-16px",
                  }}
                >
                  <Typography sx={{ color: "white", mb: -2 }}>Email</Typography>
                  <TextField
                    placeholder="Email"
                    fullWidth
                    variant="outlined"
                    size="small"
                    required
                    sx={{ bgcolor: "Window" }}
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    autoComplete="off"
                    type="email"
                  />

                  <Typography sx={{ color: "white", mb: -2 }}>
                    Ingrese una URL para su Avatar de Presentación
                  </Typography>
                  <TextField
                    placeholder="URL de la Imagen de Avatar"
                    fullWidth
                    variant="outlined"
                    size="small"
                    required
                    sx={{ bgcolor: "Window" }}
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    autoComplete="off"
                  />

                  <Typography sx={{ color: "white", mb: -2 }}>
                    Género Musical de Referencia
                  </Typography>
                  <Select
                    sx={{
                      bgcolor: "white",
                      paddingY: "4px",
                      height: "40px",
                    }}
                    value={genderPreference}
                    onChange={(e) => setGenderPreference(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="">Seleccionar Género</MenuItem>
                    {musicalGenres.map((genre, index) => (
                      <MenuItem key={index} value={genre}>
                        {genre}
                      </MenuItem>
                    ))}
                  </Select>

                  <Typography sx={{ color: "white", mb: -2 }}>
                    Ingrese una Contraseña
                  </Typography>
                  <TextField
                    placeholder="Contraseña"
                    fullWidth
                    variant="outlined"
                    size="small"
                    required
                    sx={{ bgcolor: "Window" }}
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    type="password"
                    autoComplete="off"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      mt: 2,
                      width: "auto",
                      height: "60px",
                    }}
                    onClick={handleSubmitFormSuppliers}
                  >
                    Regístrate
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      minWidth: "300px",
                      width: "100%",
                      height: "60px",
                      whiteSpace: "nowrap",
                      mt: 2,
                    }}
                    onClick={handleCloseClick}
                  >
                    Volver
                  </Button>
                </div>
              </div>
            </FormControl>
          </Box>
        </div>
      )}
      {showUserForm && (
        <UserRegistrationForm onClose={() => setShowUserForm(false)} />
      )}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: dialogBackgroundColor,
          },
        }}
      >
        <DialogTitle sx={{ color: dialogTextColor }}>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {cardText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleCloseDialog()}
            color="primary"
            sx={{ color: "black" }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserSupplierRegistration;
