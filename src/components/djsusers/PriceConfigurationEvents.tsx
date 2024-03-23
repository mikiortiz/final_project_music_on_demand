import { useEffect, useState } from "react";
import PriceEventsImg from "/images/PriceEventsImg.jpg";
import Navbar from "./NavbarSuppliers";
import {
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
  Card,
  CardContent,
  Chip,
  Box,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../model/RootStateTypes";
import { setSelectedEvents } from "../../redux/reducers/RegisteredFormSlice";

const PriceConfigurationEvents = () => {
  const [eventPrices, setEventPrices] = useState<{
    [key: string]: { price: number; hours: string };
  }>({});

  const handleDeleteEvent = (eventName: string) => {
    const updatedEvents = selectedEvents.filter(
      (event) => event.eventName !== eventName
    );
    dispatch(
      setSelectedEvents({ email: user?.userEmail, events: updatedEvents })
    );
  };

  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const selectedEvents = useSelector((state: RootState) => {
    const userEmail = user?.userEmail;
    return userEmail
      ? state.registered.DjsUsers.find(
          (djUser) => djUser.userEmail === userEmail
        )?.selectedEvents || []
      : [];
  });

  const validationSchema = yup.object({
    eventName: yup.string().required("Nombre del evento es obligatorio"),
    price: yup
      .number()
      .required("Precio es obligatorio")
      .min(0, "Precio no puede ser negativo"),
    hours: yup.string().required("Horas son obligatorias"),
  });

  const formik = useFormik({
    initialValues: {
      eventName: "",
      price: "",
      hours: "",
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      const userEmail = user?.userEmail;
      if (userEmail) {
        const updatedEvents = [
          ...selectedEvents,
          {
            eventName: formik.values.eventName,
            price: Number(formik.values.price),
            hours: formik.values.hours,
          },
        ];
        dispatch(
          setSelectedEvents({ email: userEmail, events: updatedEvents })
        );
      }
    },
  });

  useEffect(() => {
    const initialEventPrices: {
      [key: string]: { price: number; hours: string };
    } = {};
    selectedEvents.forEach((event) => {
      initialEventPrices[event.eventName] = {
        price: event.price || 0,
        hours: event.hours || "",
      };
    });
    setEventPrices(initialEventPrices);
  }, [selectedEvents]);

  return (
    <Grid
      container
      item
      xs={12}
      sm={12}
      md={12}
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100vw",
        marginTop: -7,
        backgroundImage: `url(${PriceEventsImg})`,
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
            fontWeight: "600",
            fontSize: 30,
            textAlign: "center",
            mt: "1px",
          }}
        >
          ¡MONETIZA TU TALENTO!
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
          "¡Define el valor de tu arte! Configura los precios para los eventos
          que sueñas. Ya sean íntimas celebraciones privadas o emocionantes
          festivales masivos, establece tarifas que reflejen tu pasión y
          experiencia. Personaliza tus precios para cada evento y crea
          experiencias inolvidables para tus clientes. ¡Haz que tu música sea
          apreciada y recompensada en cada nota!"
        </Typography>
      </div>

      <Grid container columnSpacing={6}>
        {selectedEvents.map((event, index) => (
          <Grid item xs={10} sm={6} md={6} key={`${event.eventName}-${index}`}>
            <Card
              sx={{
                border: "1px solid",
                borderColor: "black",
                maxWidth: "580px",
                background: "rgba(63, 81, 181, 0.8)",
                color: "white",
                height: "auto",
                width: "100%",
                mt: "15px",
                mb: "15px",
                ml: "25px",
                display: "flex",
                flexDirection: "column",
                padding: "10px",
                borderRadius: 5,
                position: "relative",
                mr: 5,
              }}
            >
              <CardContent
                sx={{
                  position: "relative",
                }}
              >
                <IconButton
                  color="secondary"
                  sx={{
                    border: "1px solid",
                    borderColor: "violet",
                    zIndex: 3,
                    position: "absolute",
                    top: 28,
                    right: 20,
                    boxShadow: "5px 5px 18px rgba(128, 0, 128, 0.9)",
                    transition: "transform 0.4s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.6)",
                      bgcolor: "black",
                      background: "rgba(0, 0, 0, 0.9)",
                    },
                  }}
                  aria-label="Eliminar"
                  onClick={() => handleDeleteEvent(event.eventName)}
                >
                  <DeleteIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    background: "rgba(0, 0, 0, 0.8)",
                    textAlign: "center",
                    borderRadius: 2,
                    mt: 1,
                    padding: 1,
                    boxShadow: "10px 0px 18px rgba(255, 255, 255, 0.9)",
                    transition: "transform 0.6s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  {event.eventName}
                </Typography>
              </CardContent>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  justifyContent: "center",
                }}
              >
                <TextField
                  autoComplete="off"
                  label="Ingrese Precio"
                  variant="filled"
                  type="number"
                  value={eventPrices[event.eventName]?.price || ""}
                  onChange={(e) => {
                    const newPrice = parseInt(e.target.value) || 0;
                    setEventPrices((prevEventPrices) => ({
                      ...prevEventPrices,
                      [event.eventName]: {
                        price: newPrice,
                        hours: prevEventPrices[event.eventName]?.hours || "",
                      },
                    }));
                  }}
                  sx={{
                    ml: "20px",
                    mr: "20px",
                    backgroundColor: "lightgray",
                    color: "black",
                    borderRadius: 1,
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                />
                <TextField
                  autoComplete="off"
                  type="number"
                  label="Ingrese Horas"
                  variant="filled"
                  value={eventPrices[event.eventName]?.hours || ""}
                  onChange={(e) => {
                    const newHours = e.target.value;
                    setEventPrices((prevEventPrices) => ({
                      ...prevEventPrices,
                      [event.eventName]: {
                        price: prevEventPrices[event.eventName]?.price || 0,
                        hours: newHours,
                      },
                    }));
                  }}
                  sx={{
                    marginRight: "20px",
                    backgroundColor: "lightgray",
                    color: "black",
                    borderRadius: 1,
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                />
              </div>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50px",
                  background: "rgba(0, 0, 0, 0.8)",
                  textAlign: "center",
                  borderRadius: 2,
                  marginTop: 1,
                  padding: 1,
                  transition: "transform 0.9s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                <div
                  style={{ flex: 1, textAlign: "right", paddingRight: "5px" }}
                >
                  <Chip
                    label={`Precio - $${event.price}`}
                    sx={{
                      padding: "8px",
                      border: "1px solid",
                      borderColor: "white",
                      background: "rgba(0, 0, 0, 0.8)",
                      color: "white",
                      borderRadius: 10,
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.1)",
                        boxShadow: "0px 5px 18px rgba(255, 255, 255, 0.3)",
                      },
                    }}
                  />
                </div>
                <div style={{ flex: 1, textAlign: "left", paddingLeft: "5px" }}>
                  <Chip
                    label={`Horas - ${event.hours || 0}`}
                    sx={{
                      border: "1px solid",
                      borderColor: "white",
                      background: "rgba(0, 0, 0, 0.8)",
                      color: "white",
                      borderRadius: 10,
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.1)",
                        boxShadow: "0px 5px 18px rgba(255, 255, 255, 0.3)",
                      },
                    }}
                  />
                </div>
              </Box>

              <Grid container>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: 10,
                    backgroundColor: "rgba(0, 0, 0, 0.9)",
                    color: "white",
                    border: "3px solid",
                    borderColor: "violet",
                    mb: 2,
                    ml: "30px",
                    width: "90%",
                    height: "70px",
                    marginTop: "10px",
                    transition: "transform 0.4s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.1)",
                      bgcolor: "black",
                      background: "rgba(0, 0, 0, 0.9)",
                      boxShadow: "5px 5px 18px rgba(0, 0, 128, 0.9)",
                    },
                  }}
                  onClick={() => {
                    const userEmail = user?.userEmail;
                    if (userEmail) {
                      const eventsWithPricesAndHours = selectedEvents.map(
                        (event) => {
                          const eventName = event.eventName;
                          const eventInfo = eventPrices[eventName] || {
                            price: 0,
                            hours: "",
                          };
                          return {
                            eventName,
                            price: eventInfo.price,
                            hours: eventInfo.hours,
                          };
                        }
                      );

                      dispatch(
                        setSelectedEvents({
                          email: userEmail,
                          events: eventsWithPricesAndHours,
                        })
                      );
                    }
                  }}
                >
                  Guardar Tarifa
                </Button>
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default PriceConfigurationEvents;
