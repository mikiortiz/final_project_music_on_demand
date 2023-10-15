import { useState, useEffect } from "react";
import { Avatar, Card, CardContent, Grid, Typography } from "@mui/material";
import Navbar from "../components/NavbarSuppliers";
import { eventTypes } from "../model/EventTypes";
import EventsSuppliers from "../../public/images/EventsSuppliers.jpg";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedEvents } from "../redux/reducers/RegisteredFormSlice";
import { RootState } from "../model/RootStateTypes";

const TypesEvents = () => {
  const [selectedCards, setSelectedCards] = useState(new Set());
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.userLogin.user);
  const userEmail = user?.userEmail;
  const DjsUsers = useSelector((state: RootState) => state.registered.DjsUsers);

  useEffect(() => {
    // Inicializar selectedCards con los eventos seleccionados del Redux Store
    if (userEmail) {
      const user = DjsUsers.find((user) => user.userEmail === userEmail);
      if (user && user.selectedEvents) {
        setSelectedCards(new Set(user.selectedEvents));
      }
    }
  }, [userEmail, DjsUsers]); // Vuelve a ejecutarse si el userEmail o DjsUsers cambian

  const handleCardClick = (eventName: string) => {
    const updatedSelectedCards = new Set(selectedCards);
    if (updatedSelectedCards.has(eventName)) {
      updatedSelectedCards.delete(eventName);
    } else {
      updatedSelectedCards.add(eventName);
    }

    // Convierte el conjunto a un array y asegúrate de que todos los elementos sean de tipo string
    const selectedEventsArray: string[] = Array.from(updatedSelectedCards).map(String);

    // Dispara la acción setSelectedEvents con el email del usuario y los eventos seleccionados
    dispatch(setSelectedEvents({ email: userEmail, events: selectedEventsArray }));
    setSelectedCards(updatedSelectedCards);
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
        backgroundImage: `url(${EventsSuppliers})`,
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
          ELECCIÓN DE TIPOS DE EVENTOS
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
          "Selecciona tus tipos de eventos preferidos. Desde fiestas privadas
          íntimas hasta eventos masivos en clubes nocturnos, elige los tipos de
          eventos que te apasionan y define tu carrera como DJ. Personaliza tus
          sets para cada ocasión y haz que cada evento sea único. ¡Explora,
          mezcla y haz que el mundo baile con tu música!"
        </Typography>
      </div>

      {eventTypes.map((eventType, eventName) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={eventName}>
          <Card
            onClick={() => handleCardClick(eventType.name)}
            sx={{
              background: "rgba(0, 0, 0, 0.7)",
              borderRadius: 2,
              border: 1,
              borderColor: "black",
              height: "154px",
              width: "93%",
              margin: "3px",
              ml: "13px",
              color: "white",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <CardContent
              sx={{
                zIndex: 1,
                textAlign: "center",
                borderBottom: 1,
                height: 10,
                borderRadius: 2,
                backgroundColor: selectedCards.has(eventType.name)
                  ? "#7b1fa2"
                  : "transparent",
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{
                  mt: -1,
                  fontSize: 15,
                }}
              >
                {eventType.name}
              </Typography>
            </CardContent>
            <CardContent sx={{ height: "90px" }}>
              <Avatar
                src={eventType.image}
                alt={`${eventType.name} Image`}
                sx={{
                  ml: "-9px",
                  mt: "-15px",
                  width: "106%",
                  height: "125%",
                  borderRadius: 1,
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default TypesEvents;
