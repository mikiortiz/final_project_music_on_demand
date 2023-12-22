import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../model/RootStateTypes";
import { addUser } from "../redux/reducers/RegisteredFormSlice";
import CardImageUsers from "/images/CardImageUsers.png";
import {
  Button,
  TextField,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  Grid,
} from "@mui/material";

const UserRegistrationForm = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useDispatch();
  const registeredSuppliers = useSelector(
    (state: RootState) => state.registered.DjsUsers
  );
  const registeredUsers = useSelector(
    (state: RootState) => state.registered.MusicUsers
  );

  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogText, setDialogText] = useState("");
  const [dialogBackgroundColor, setDialogBackgroundColor] = useState("white");
  const [dialogTextColor, setDialogTextColor] = useState("black");
  const [openCardDialog, setOpenCardDialog] = useState(false);

  const validationSchema = yup.object({
    userEmail: yup
      .string()
      .email("Ingresa un correo electrónico válido")
      .required("Correo electrónico es obligatorio"),
    userPassword: yup
      .string()
      .min(4, "La contraseña debe tener al menos 4 caracteres")
      .required("Contraseña es obligatoria"),
    userFirstName: yup.string().required("Nombre es obligatorio"),
    userLastName: yup.string().required("Apellido es obligatorio"),
    userAge: yup
      .number()
      .positive("La edad debe ser un número positivo")
      .integer("La edad debe ser un número entero")
      .required("Edad es obligatoria")
      .min(18, "Debes ser mayor de 18 años"),
    customUserAvatarUrl: yup
      .string()
      .url("Ingresa una URL válida")
      .required("URL de avatar es obligatoria"),
    userContactNumber: yup
      .string()
      .min(6, "El número de contacto debe tener al menos 6 caracteres")
      .required("Número de contacto es obligatorio"),
  });

  const formik = useFormik({
    initialValues: {
      userEmail: "",
      userPassword: "",
      userFirstName: "",
      userLastName: "",
      userAge: "",
      customUserAvatarUrl: "",
      userContactNumber: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const isEmailUsed =
        (registeredSuppliers &&
          registeredSuppliers.some(
            (supplier: { userEmail: string }) =>
              supplier.userEmail === values.userEmail
          )) ||
        (registeredUsers &&
          registeredUsers.some(
            (user: { userEmail: string }) => user.userEmail === values.userEmail
          ));

      if (isEmailUsed) {
        setDialogTitle("Error de Registro");
        setDialogText(
          "Este correo electrónico ya está registrado, por favor, elija otro correo electrónico."
        );
        setDialogBackgroundColor("white");
        setDialogTextColor("black");
        setShowDialog(true);
        return;
      }

      if (!isUserAdult(values.userAge)) {
        setDialogTitle("Error de Registro");
        setDialogText("Debes ser Mayor de 18 Años para Registrarte.");
        setDialogBackgroundColor("white");
        setDialogTextColor("black");
        setShowDialog(true);
        return;
      }

      dispatch(addUser(values));

      formik.resetForm();
      setDialogText("Registrado exitosamente");
      setDialogTitle("Éxito");
      setDialogBackgroundColor("green");
      setDialogTextColor("white");
      setShowDialog(true);
    },
  });

  const isUserAdult = (age: string) => {
    return parseInt(age) >= 18;
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    if (dialogTitle === "Éxito") {
      onClose();
    }
  };

  const handleCloseCardDialog = () => {
    setOpenCardDialog(false);
  };

  const handleCloseForm = () => {
    setShowDialog(false);
    onClose();
  };

  return (
    <Grid
      container
      item
      xs={12}
      sm={12}
      md={12}
      style={{
        borderRadius: "20px",
        color: "white",
        position: "fixed",
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
        height: "95%",
        margin: "auto",
        boxShadow: "0px 0px 100px rgba(0, 0, 0, 1 )",
      }}
    >
      <Grid
        item
        sm={12}
        md={12}
        xs={12}
        sx={{
          backgroundImage: `url(${CardImageUsers})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "90%",
          width: "90%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "1rem",
          borderRadius: "10px",
          display: "flex",
        }}
      >
        <Grid item xs={6} sm={6} md={6} sx={{ marginLeft: 1 }}>
          <form onSubmit={formik.handleSubmit}>
            <FormControl fullWidth>
              <Typography sx={{ color: "white" }}>Nombre</Typography>
              <TextField
                placeholder="Nombre"
                fullWidth
                variant="outlined"
                size="small"
                required
                sx={{ bgcolor: "Window", borderRadius: "10px" }}
                {...formik.getFieldProps("userFirstName")}
                autoComplete="off"
                error={
                  formik.touched.userFirstName &&
                  Boolean(formik.errors.userFirstName)
                }
                helperText={
                  formik.touched.userFirstName && formik.errors.userFirstName
                }
              />
              <Typography sx={{ color: "white", mt: 1 }}>Apellido</Typography>
              <TextField
                placeholder="Apellido"
                fullWidth
                variant="outlined"
                size="small"
                required
                sx={{ bgcolor: "Window", borderRadius: "10px" }}
                {...formik.getFieldProps("userLastName")}
                autoComplete="off"
                error={
                  formik.touched.userLastName &&
                  Boolean(formik.errors.userLastName)
                }
                helperText={
                  formik.touched.userLastName && formik.errors.userLastName
                }
              />
              <Typography sx={{ color: "white", mt: 1 }}>Edad</Typography>
              <TextField
                placeholder="Edad"
                fullWidth
                variant="outlined"
                size="small"
                required
                sx={{ bgcolor: "Window", borderRadius: "10px" }}
                {...formik.getFieldProps("userAge")}
                autoComplete="off"
                error={formik.touched.userAge && Boolean(formik.errors.userAge)}
                helperText={formik.touched.userAge && formik.errors.userAge}
              />
              <Typography sx={{ color: "white", mt: 1 }}>
                Número de Contacto
              </Typography>
              <TextField
                placeholder="Número de Contacto"
                fullWidth
                variant="outlined"
                size="small"
                required
                sx={{ bgcolor: "Window", borderRadius: "10px" }}
                {...formik.getFieldProps("userContactNumber")}
                autoComplete="off"
                error={
                  formik.touched.userContactNumber &&
                  Boolean(formik.errors.userContactNumber)
                }
                helperText={
                  formik.touched.userContactNumber &&
                  formik.errors.userContactNumber
                }
              />
              <Grid
                container
                item
                xs={12}
                sm={12}
                md={12}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  borderRadius: "5px",
                  marginTop: "5px",
                }}
              >
                <Typography
                  variant="h5"
                  align="center"
                  color="white"
                  marginTop={9}
                  marginRight={"40px"}
                >
                  Tu Avatar
                </Typography>
                <Grid item xs={12} sm={4} md={4}>
                  <Avatar
                    alt="Avatar"
                    src={formik.values.customUserAvatarUrl}
                    sx={{
                      width: 150,
                      height: 150,
                      marginTop: "5px",
                    }}
                  />
                </Grid>
              </Grid>
            </FormControl>
          </form>
        </Grid>

        <Grid item xs={6} sm={6} md={6} sx={{ marginLeft: 1 }}>
          <form onSubmit={formik.handleSubmit}>
            <FormControl fullWidth>
              <Typography sx={{ color: "white", mb: -2 }}>Email</Typography>
              <TextField
                placeholder="Email"
                fullWidth
                variant="outlined"
                size="small"
                sx={{ bgcolor: "Window", borderRadius: "10px", mt: 2 }}
                {...formik.getFieldProps("userEmail")}
                autoComplete="off"
                type="email"
                error={
                  formik.touched.userEmail && Boolean(formik.errors.userEmail)
                }
                helperText={formik.touched.userEmail && formik.errors.userEmail}
              />
              <Typography sx={{ color: "white", mt: 1 }}>
                Ingrese una URL para su Avatar de Presentación
              </Typography>
              <TextField
                placeholder="URL de la Imagen de Avatar"
                fullWidth
                variant="outlined"
                size="small"
                sx={{ bgcolor: "Window", borderRadius: "10px" }}
                {...formik.getFieldProps("customUserAvatarUrl")}
                autoComplete="off"
                error={
                  formik.touched.customUserAvatarUrl &&
                  Boolean(formik.errors.customUserAvatarUrl)
                }
                helperText={
                  formik.touched.customUserAvatarUrl &&
                  formik.errors.customUserAvatarUrl
                }
              />

              <Typography sx={{ color: "white", mt: 1 }}>
                Ingrese una Contraseña
              </Typography>
              <TextField
                placeholder="Contraseña"
                fullWidth
                variant="outlined"
                size="small"
                sx={{ bgcolor: "Window", borderRadius: "10px" }}
                {...formik.getFieldProps("userPassword")}
                type="password"
                autoComplete="off"
                error={
                  formik.touched.userPassword &&
                  Boolean(formik.errors.userPassword)
                }
                helperText={
                  formik.touched.userPassword && formik.errors.userPassword
                }
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: "10px",
                  mt: 4,
                  width: "auto",
                  height: "60px",
                }}
              >
                Regístrate
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: "10px",
                  mt: 4,
                  width: "auto",
                  height: "60px",
                }}
                onClick={handleCloseForm}
              >
                Volver
              </Button>

              <Dialog
                open={showDialog}
                onClose={() => setShowDialog(false)}
                PaperProps={{
                  sx: {
                    backgroundColor: dialogBackgroundColor,
                  },
                }}
              >
                <DialogTitle sx={{ color: dialogTextColor }}>
                  {dialogTitle}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText
                    sx={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                    }}
                  >
                    {dialogText}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleCloseDialog}
                    color="primary"
                    sx={{ color: "black" }}
                  >
                    Cerrar
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog
                open={openCardDialog}
                onClose={handleCloseCardDialog}
                PaperProps={{
                  sx: {
                    backgroundColor: dialogBackgroundColor,
                  },
                }}
              >
                <DialogTitle sx={{ color: dialogTextColor }}>
                  {dialogTitle}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText
                    sx={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                    }}
                  ></DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleCloseCardDialog}
                    color="primary"
                    sx={{ color: "black" }}
                  >
                    Cerrar
                  </Button>
                </DialogActions>
              </Dialog>
            </FormControl>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UserRegistrationForm;
