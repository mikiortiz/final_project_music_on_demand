import { useState, useEffect } from "react";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { Avatar, Card, CardContent, Grid, Typography } from "@mui/material";
import Navbar from "./NavbarSuppliers";
import { eventTypes } from "../../model/EventTypes";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedEvents } from "../../redux/reducers/RegisteredFormSlice";
import { RootState } from "../../model/RootStateTypes";
import EventsSuppliers from "/images/EventsSuppliers.jpg";
import { Event } from "../../model/SupplierData";

const TypesEvents = () => {
  const [selectedCards, setSelectedCards] = useState<Event[]>([]);
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const userEmail = user?.userEmail;
  const DjsUsers = useSelector((state: RootState) => state.registered.DjsUsers);

  useEffect(() => {
    // Se inicializan las Cards con los eventos seleccionados del Store
    if (userEmail) {
      const user = DjsUsers.find((user) => user.userEmail === userEmail);
      if (user && user.selectedEvents) {
        setSelectedCards(user.selectedEvents);
      }
    }
  }, [userEmail, DjsUsers]);

  const handleCardClick = (eventName: string) => {
    const clickedEvent = eventTypes.find((event) => event.name === eventName);
    if (clickedEvent) {
      const isSelected = selectedCards.some(
        (event) => event.eventName === clickedEvent.name
      );
      const updatedSelectedCards: Event[] = isSelected
        ? selectedCards.filter((event) => event.eventName !== clickedEvent.name)
        : [
            ...selectedCards,
            {
              eventName: clickedEvent.name,
              price: 0,
              hours: "",
            },
          ];
      dispatch(
        setSelectedEvents({ email: userEmail, events: updatedSelectedCards })
      );
      setSelectedCards(updatedSelectedCards);
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

      {eventTypes.map((eventType) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={eventType.name}>
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
              position: "relative",
            }}
          >
            <CardContent
              sx={{
                zIndex: 999,
                textAlign: "center",
                borderBottom: 1,
                borderColor: "black",
                height: 10,
                borderRadius: 2,
                backgroundColor: selectedCards.some(
                  (event) => event.eventName === eventType.name
                )
                  ? "rgba(63, 81, 181, 0.8)"
                  : "transparent",
                boxShadow: selectedCards.some(
                  (event) => event.eventName === eventType.name
                )
                  ? "-10px 30px 60px rgba(255, 255, 255, 0.9)"
                  : "none",
                position: "absolute",
                top: 0,
                left: 0,
                width: "90%",
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
              {selectedCards.some(
                (event) => event.eventName === eventType.name
              ) && (
                <VerifiedOutlinedIcon
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: "5px",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    color: "lightblue",
                    fontSize: "32px",
                    mr: 1,
                  }}
                />
              )}
            </CardContent>
            <CardContent sx={{ height: "90px" }}>
              <Avatar
                src={eventType.image}
                alt={`${eventType.name} Image`}
                sx={{
                  ml: "-9px",
                  mt: "30px",
                  width: "106%",
                  height: "125%",
                  borderRadius: 1,
                  position: "relative",
                  zIndex: 1,
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
