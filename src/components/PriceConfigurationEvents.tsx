import { useEffect, useState } from "react";
import PriceEventsImg from "../../public/images/PriceEventsImg.jpg";
import Navbar from "../components/NavbarSuppliers";
import {
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../model/RootStateTypes";
import { setSelectedEvents } from "../redux/reducers/RegisteredFormSlice";

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
  const user = useSelector((state: RootState) => state.userLogin.user);
  const selectedEvents = useSelector((state: RootState) => {
    const userEmail = user?.userEmail;
    return userEmail
      ? state.registered.DjsUsers.find(
          (djUser) => djUser.userEmail === userEmail
        )?.selectedEvents || []
      : [];
  });
  // Establecer los valores iniciales de eventPrices cuando selectedEvents se actualiza
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
        marginTop: -7,
        height: "auto",
        width: "100vw",
        backgroundImage: `url(${PriceEventsImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
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

      <List sx={{ width: "100%", height: "100%" }}>
        {selectedEvents.map((event, index) => (
          <ListItem
            key={`${event.eventName}-${index}`}
            sx={{
              background: "rgba(0, 0, 0, 0.7)",
              color: "white",
              height: "100%",
              width: "100%",
              mt: "1px",
            }}
          >
            <Grid item xs={4} sm={4} md={4}>
              <ListItemText primary={`${event.eventName}`} />
            </Grid>
            <Grid item xs={4} sm={4} md={4}>
              <ListItemText
                primary={`Precio - ${event.price}, Horas - ${event.hours || 0}`}
              />
            </Grid>

            <TextField
              autoComplete="off"
              label=" Ingrese Precio"
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
              style={{
                marginRight: "20px",
                backgroundColor: "lightgray",
                color: "black",
                borderRadius: 5,
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
              style={{
                marginRight: "20px",
                backgroundColor: "lightgray",
                color: "black",
                borderRadius: 5,
              }}
            />
            <Grid container sx={{ width: "100px" }}>
              <IconButton
                color="secondary"
                edge="end"
                aria-label="Eliminar"
                onClick={() => handleDeleteEvent(event.eventName)}
              >
                <Typography>Eliminar</Typography>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </ListItem>
        ))}
        <Button
          sx={{
            marginLeft: "5%",
            marginTop: "20px",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            color: "white",
            width: "90%",
            height: "60px",
            borderRadius: 2,
          }}
          variant="contained"
          onClick={() => {
            const userEmail = user?.userEmail;
            if (userEmail) {
              const eventsWithPricesAndHours = selectedEvents.map((event) => {
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
              });

              dispatch(
                setSelectedEvents({
                  email: userEmail,
                  events: eventsWithPricesAndHours,
                })
              );
            }
          }}
        >
          Guardar
        </Button>
      </List>
    </Grid>
  );
};

export default PriceConfigurationEvents;