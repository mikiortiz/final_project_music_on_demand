import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Grid,
  FormControl,
  TextField,
} from "@mui/material";
import { Modal, Box } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { RootState } from "../model/RootStateTypes";
import { useNavigate } from "react-router-dom";
import logomusic from "/images/Logomusic.png";
import IconButton from "@mui/material/IconButton";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  onClose: () => void;
}

interface User {
  userEmail: string;
  userPassword: string;
}

const LoginForm: React.FC<Props> = ({ onClose }) => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const djUsers = useSelector((state: RootState) => state.registered.DjsUsers);
  const musicUsers = useSelector(
    (state: RootState) => state.registered.MusicUsers
  );

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("Ingresa un correo electrónico válido")
        .required("Correo electrónico es obligatorio"),
      password: yup.string().required("Contraseña es obligatoria"),
    }),
    onSubmit: () => {
      handleLogin();
    },
  });

  const handleLogin = () => {
    const { email, password } = formik.values;

    if (email.trim() === "" || password.trim() === "") {
      ShowWindowDialog("Login incompleto");
      return;
    }

    const supplier = djUsers.find(
      (u) => u.userEmail === email && u.userPassword === password
    );
    const user = musicUsers.find(
      (s) => s.userEmail === email && s.userPassword === password
    );

    if (user) {
      const userToStore = { ...user, userType: "user" };
      localStorage.setItem("currentUser", JSON.stringify(userToStore));

      navigate("/usermaphome");
    } else if (supplier) {
      const supplierToStore = { ...supplier, userType: "supplier" };
      localStorage.setItem("currentUser", JSON.stringify(supplierToStore));

      navigate("/supplierwelcome");
    } else {
      ShowWindowDialog("Los datos ingresados son incorrectos");
    }
  };

  const ShowWindowDialog = (mensaje: string) => {
    window.alert(mensaje);
  };

  const handleUserSelection = (user: User) => {
    setSelectedUser(user);
    closeModal();
  };

  useEffect(() => {
    if (selectedUser) {
      formik.setValues({
        email: selectedUser.userEmail,
        password: selectedUser.userPassword,
      });
    }
  }, [selectedUser]);

  return (
    <>
      <Grid
        item
        xs={12}
        style={{
          marginTop: "-225px",
          borderRadius: "10px",
          position: "fixed",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "580px",
          width: "900px",
          zIndex: 9999,
          backgroundImage: `url(${logomusic})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Grid
          container
          item
          xs={10}
          sm={10}
          md={10}
          sx={{
            color: "white",
            borderRadius: "10px",
            width: "550px",
            height: "500px",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              mt: -5,
              mb: 10,
            }}
          >
            Iniciar Sesión
          </Typography>
          <Grid sx={{ width: "90%", position: "absolute", mt: 5 }}>
            <form onSubmit={formik.handleSubmit}>
              <FormControl style={{ width: "100%" }}>
                <Typography mb={-2}>Email</Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  margin="normal"
                  type="email"
                  autoComplete="username"
                  {...formik.getFieldProps("email")}
                  sx={{ backgroundColor: "white", marginBottom: "1rem" }}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                {formik.touched.email && formik.errors.email && (
                  <Typography variant="caption" color="red" mt={-2} mb={2}>
                    {formik.errors.email}
                  </Typography>
                )}
                <Typography mb={-2}>Contraseña</Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  margin="normal"
                  type="password"
                  autoComplete="current-password"
                  {...formik.getFieldProps("password")}
                  sx={{ backgroundColor: "white", marginBottom: "1rem" }}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
                {formik.touched.password && formik.errors.password && (
                  <Typography variant="caption" color="red" mt={-2} mb={2}>
                    {formik.errors.password}
                  </Typography>
                )}

                <Button
                  type="submit"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  style={{
                    marginTop: 3,
                    height: "60px",
                    backgroundColor: "rgba(0, 128, 255, 0.5)",
                    color: "white",
                    borderColor: "black",
                  }}
                  sx={{
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.2)",
                    },
                  }}
                >
                  Iniciar Sesión
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={onClose}
                  style={{
                    marginTop: 30,
                    height: "60px",
                    backgroundColor: "rgba(0, 128, 255, 0.5)",
                    color: "white",
                    borderColor: "black",
                  }}
                  sx={{
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.2)",
                    },
                  }}
                >
                  Registrarse aquí
                </Button>
                <Grid
                  container
                  item
                  xs={12}
                  style={{
                    backgroundColor: "green",
                    marginTop: 10,
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 18px rgba(255, 255, 255, 0.7)",
                    borderRadius: 50,
                    width: "200px",
                    marginLeft: 100,
                  }}
                  sx={{
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.2)",
                    },
                  }}
                >
                  <IconButton
                    onClick={openModal}
                    sx={{
                      color: "white",
                      zIndex: 2,
                    }}
                  >
                    <RecentActorsIcon sx={{ fontSize: 40 }} />
                    <Typography sx={{ fontSize: 15, ml: 1 }}>
                      Usuarios de Prueba
                    </Typography>
                  </IconButton>
                </Grid>

                <Modal
                  open={isModalOpen}
                  onClose={closeModal}
                  aria-labelledby="modal-title"
                  aria-describedby="modal-description"
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginLeft: -1,
                      transform: "translate(-50%, -50%)",
                      width: "auto",
                      bgcolor: "background.paper",
                      borderRadius: 2,
                      boxShadow: 24,
                      p: 4,
                      backgroundColor: "#0072B9",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    <IconButton
                      onClick={closeModal}
                      sx={{
                        width: "25px",
                        height: "25px",
                        border: 1,
                        color: "white",
                        position: "absolute",
                        top: 5,
                        right: 5,
                        zIndex: 2,
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <Typography
                      id="modal-title"
                      component="h2"
                      sx={{
                        padding: 1,
                        mt: -2,
                        fontSize: 15,
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        borderRadius: 2,
                      }}
                    >
                      " En esta sección podrás elegir un usuario de prueba para
                      ingresar "
                    </Typography>
                    <Typography
                      id="modal-title"
                      variant="h6"
                      component="h2"
                      sx={{ mb: -2, textDecoration: "underline" }}
                    >
                      Djs Users
                    </Typography>
                    <ul style={{ listStyle: "none" }}>
                      {djUsers.map((djUser) => (
                        <Grid
                          key={djUser.userEmail}
                          sx={{
                            transition: "transform 0.3s ease-in-out",
                            "&:hover": {
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          <li
                            onClick={() => handleUserSelection(djUser)}
                            style={{
                              zIndex: 9999,
                              marginLeft: -40,
                              padding: 8,
                              cursor: "pointer",
                              marginBottom: 10,
                              backgroundColor: "rgba(0, 0, 0, 0.7)",
                              borderRadius: 10,
                              marginTop: -4,
                            }}
                          >
                            <Grid
                              sx={{
                                transition: "transform 0.6s ease-in-out",
                                "&:hover": {
                                  transform: "scale(1.5)",
                                },
                              }}
                            >
                              <Typography
                                sx={{ fontSize: 15 }}
                              >{`EMAIL: ${djUser.userEmail}`}</Typography>
                              <Typography
                                sx={{ fontSize: 15 }}
                              >{`CONTRASEÑA: ${djUser.userPassword}`}</Typography>
                            </Grid>
                          </li>
                        </Grid>
                      ))}
                    </ul>

                    <Typography
                      id="modal-title"
                      variant="h6"
                      component="h2"
                      sx={{ mt: -2, mb: -2, textDecoration: "underline" }}
                    >
                      Music Users
                    </Typography>
                    <ul style={{ listStyle: "none" }}>
                      {musicUsers.map((musicUser) => (
                        <Grid
                          key={musicUser.userEmail}
                          sx={{
                            transition: "transform 0.3s ease-in-out",
                            "&:hover": {
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          <li
                            key={musicUser.userEmail}
                            onClick={() => handleUserSelection(musicUser)}
                            style={{
                              marginLeft: -40,
                              padding: 8,
                              cursor: "pointer",
                              marginBottom: 10,
                              backgroundColor: "rgba(0, 0, 0, 0.7)",
                              borderRadius: 10,
                              marginTop: -4,
                            }}
                          >
                            <Grid
                              sx={{
                                transition: "transform 0.6s ease-in-out",
                                "&:hover": {
                                  transform: "scale(1.5)",
                                },
                              }}
                            >
                              <Typography
                                sx={{ fontSize: 15 }}
                              >{`EMAIL: ${musicUser.userEmail}`}</Typography>
                              <Typography
                                sx={{ fontSize: 15 }}
                              >{`CONTRASEÑA: ${musicUser.userPassword}`}</Typography>
                            </Grid>
                          </li>
                        </Grid>
                      ))}
                    </ul>
                  </Box>
                </Modal>
              </FormControl>
            </form>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default LoginForm;
