import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../model/RootStateTypes";
import { SupplierData } from "../../model/SupplierData";
import { Area } from "../../model/AreaType";
import NavbarUser from "./NavbarUsers";
import {
  Button,
  CardMedia,
  Chip,
  Grid,
  List,
  ListItem,
  Typography,
  Badge,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import { UserData } from "../../model/UserData";
import { eventTypes } from "../../model/EventTypes";
import { useNavigate } from "react-router-dom";

const UserWelcome = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const MusicUsers = useSelector(
    (state: RootState) => state.registered.MusicUsers
  );
  const userEmail = user?.userEmail;

  const selectedMusicUser: UserData | undefined = MusicUsers.find(
    (musicUser) => musicUser.userEmail === userEmail
  );

  const [selectedDjAreas, setSelectedDjAreas] = useState<Area[]>([]);
  const [selectedDjContractsCount, setSelectedDjContractsCount] = useState<
    Record<string, number>
  >({});
  const [eventContractsCount, setEventContractsCount] = useState<
    Record<string, number>
  >({});

  const DjsUsers = useSelector((state: RootState) => state.registered.DjsUsers);
  const userContracts = useSelector(
    (state: RootState) => state.contract.contracts
  );

  const isMarkerInArea = (
    marker: { lat: any; lng: any } | undefined,
    area: Area
  ) => {
    if (!marker) {
      return false;
    }

    const radius = area.radius || 0;

    const km = radius / 1000;
    const kx = Math.cos((Math.PI * Number(area.lat)) / 180) * 111;
    const dx = Math.abs(Number(area.lng) - marker.lng) * kx;
    const dy = Math.abs(Number(area.lat) - marker.lat) * 111;

    return Math.sqrt(dx * dx + dy * dy) <= km;
  };

  useEffect(() => {
    if (selectedMusicUser && selectedMusicUser.area) {
      const musicUserMarker: Area[] = selectedMusicUser.area;

      const matchingDjAreas = DjsUsers.reduce(
        (acc: Area[], djUser: SupplierData) => {
          const areas =
            djUser.areas?.filter((area) =>
              isMarkerInArea(musicUserMarker[0], area)
            ) || [];
          return [...acc, ...areas];
        },
        []
      );

      setSelectedDjAreas(matchingDjAreas);

      const djContractsCount: Record<string, number> = {};
      userContracts.forEach((userContract) => {
        const djEmail = userContract.contract.djInfo?.DjEmail;
        if (djEmail) {
          djContractsCount[djEmail] = (djContractsCount[djEmail] || 0) + 1;
        }
      });
      setSelectedDjContractsCount(djContractsCount);

      const eventContractsCount: Record<string, number> = {};
      userContracts.forEach((userContract) => {
        const eventName = userContract.contract.eventName;
        eventContractsCount[eventName] =
          (eventContractsCount[eventName] || 0) + 1;
      });
      setEventContractsCount(eventContractsCount);
    }
  }, [selectedMusicUser, DjsUsers, userContracts]);

  const handleContractClick = (dj: SupplierData) => {
    navigate("/contractconfiguration", { state: { selectedDj: dj } });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedEvent, setSelectedEvent] = React.useState<SupplierData | null>(
    null
  );

  const handleMenuClick = (event: any, eventItem: SupplierData) => {
    setAnchorEl(event.currentTarget);
    setSelectedEvent(eventItem);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  return (
    <div
      style={{
        height: "100%",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        alignItems: "center",
      }}
    >
      <Grid
        container
        item
        xs={12}
        sm={12}
        md={12}
        sx={{ background: "rgba(0, 0, 0, 0.5)" }}
      >
        <NavbarUser />
        <Typography
          variant="h5"
          style={{
            marginTop: "1px",
            width: "100%",
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "10px",
            textAlign: "center",
            fontWeight: "bolder",
          }}
        >
          Djs Cercanos En
        </Typography>
        {selectedDjAreas.length > 0 ? (
          selectedDjAreas.map((area: Area) => (
            <Grid container item xs={12} sm={12} md={12} key={area.name}>
              <Typography
                variant="h4"
                style={{
                  marginTop: 1,
                  width: "100%",
                  background: "rgba(0, 0, 0, 0.6)",
                  color: "white",
                  padding: "10px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {area.name}
              </Typography>
              {DjsUsers.filter((djUser: SupplierData) =>
                djUser.areas?.some((a) => a.name === area.name)
              ).map((dj: SupplierData) => (
                <Grid
                  container
                  item
                  xs={12}
                  key={dj.userEmail}
                  sx={{ padding: "10px" }}
                >
                  <Grid item xs={4}>
                    <Grid
                      container
                      alignItems="center"
                      sx={{
                        mt: "-5px",
                        borderRadius: "7px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                        textAlign: "center",
                        marginBottom: "30px",
                        color: "white",
                        background: "rgba(0, 0, 0, 0.9)",
                        padding: "10px",
                      }}
                    >
                      <Grid item>
                        <Typography variant="h6">
                          {dj.userFirstName} {dj.userLastName}
                        </Typography>
                      </Grid>

                      <Grid item sx={{ marginLeft: "auto" }}>
                        <Typography
                          sx={{
                            marginBottom: -4,
                            marginTop: 1,
                            marginLeft: -11,
                            fontSize: "15px",
                          }}
                        >
                          Recomendado
                        </Typography>
                        {selectedDjContractsCount[dj.userEmail] > 0 && (
                          <Badge
                            badgeContent={
                              selectedDjContractsCount[dj.userEmail] || 0
                            }
                            color="primary"
                            sx={{
                              fontFamily: "cursive",
                              color: "white",
                              marginLeft: 5,
                            }}
                          >
                            <IconButton
                              color="inherit"
                              onClick={(event) => handleMenuClick(event, dj)}
                            >
                              <MenuIcon />
                            </IconButton>
                          </Badge>
                        )}
                      </Grid>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        {selectedEvent &&
                          selectedEvent.selectedEvents?.map(
                            (event: any, index: any) => (
                              <MenuItem
                                key={`${event.eventName}-${index}`}
                                onClick={() => handleContractClick(dj)}
                              >
                                {event.eventName}
                                <Badge
                                  badgeContent={
                                    eventContractsCount[event.eventName] || 0
                                  }
                                  color="primary"
                                  sx={{ marginLeft: 2 }}
                                ></Badge>
                              </MenuItem>
                            )
                          )}
                      </Menu>
                    </Grid>

                    <CardMedia
                      component="img"
                      height="140"
                      image={dj.customAvatarUrl}
                      alt={`Avatar de ${dj.userFirstName} ${dj.userLastName}`}
                      sx={{
                        borderRadius: "8px",
                        mt: "-20px",
                        height: "250px",
                        width: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                    <Grid
                      item
                      xs={12}
                      sx={{
                        borderRadius: "8px",
                        mt: 1,
                        textAlign: "center",
                        color: "white",
                        padding: "0 10px",
                        background: "rgba(0, 0, 0, 0.9)",
                      }}
                    >
                      <Typography>Email:</Typography>
                      <Typography
                        sx={{ overflowWrap: "break-word", maxWidth: "100%" }}
                      >
                        {dj.userEmail}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        mt: 1,
                        textAlign: "center",
                        color: "white",
                        padding: "0 10px",
                        background: "rgba(0, 0, 0, 0.9)",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography>Numero de contacto:</Typography>
                      <Typography
                        sx={{ overflowWrap: "break-word", maxWidth: "100%" }}
                      >
                        {dj.userContactNumber}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        mt: 1,
                        textAlign: "center",
                        color: "white",
                        padding: "0 10px",
                        background: "rgba(0, 0, 0, 0.9)",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography>Géneros:</Typography>
                      {dj.selectedGenres?.map((genre) => (
                        <Chip
                          key={genre}
                          label={genre}
                          variant="outlined"
                          color="primary"
                          sx={{
                            margin: 0.5,
                            background: "rgba(0, 0, 0, 0.5)",
                            color: "white",
                          }}
                        />
                      ))}
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={8}
                    sx={{ padding: "0 10px", textAlign: "center", mt: "-5px" }}
                  >
                    <Typography
                      sx={{
                        color: "white",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                        textAlign: "center",
                        background: "rgba(0, 0, 0, 0.9)",
                        borderRadius: "8px",
                        padding: "10px",
                      }}
                    >
                      Eventos:
                    </Typography>

                    <List
                      sx={{
                        mt: "2px",
                        color: "white",
                      }}
                    >
                      {dj.selectedEvents?.map((event, index) => {
                        const eventType = eventTypes.find(
                          (type) => type.name === event.eventName
                        );
                        return (
                          <Grid
                            item
                            xs={12}
                            xl={12}
                            container
                            justifyContent="center"
                            key={`${event.eventName}-${index}`}
                          >
                            <ListItem
                              sx={{
                                background: "rgba(0, 0, 0, 0.9)",
                                borderRadius: "8px",
                                textAlign: "center",
                                marginBottom: "5px",
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                padding: "10px",
                              }}
                            >
                              {eventType && eventType.image && (
                                <Grid item xs={4} xl={4}>
                                  <CardMedia
                                    component="img"
                                    height="60"
                                    image={eventType.image}
                                    alt={event.eventName}
                                    style={{
                                      width: "100%",
                                      objectFit: "cover",
                                      borderRadius: "8px",
                                    }}
                                  />
                                </Grid>
                              )}
                              <Grid
                                item
                                xs={4}
                                xl={4}
                                style={{ textAlign: "center" }}
                              >
                                <Typography sx={{ overflowWrap: "break-word" }}>
                                  {event.eventName}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={4}
                                xl={4}
                                container
                                flexDirection="column"
                                justifyContent="center"
                              >
                                <Typography>{`Precio: ${event.price}`}</Typography>
                                <Typography>{`X Horas: ${event.hours}`}</Typography>
                              </Grid>
                            </ListItem>
                          </Grid>
                        );
                      })}
                    </List>
                  </Grid>
                  <Grid
                    container
                    sx={{
                      mt: 1,
                      borderRadius: 5,
                      background: "rgba(0, 0, 0, 0.9)",
                      marginBottom: "20px",
                    }}
                  >
                    <Button
                      onClick={() => handleContractClick(dj)}
                      variant="outlined"
                      color="primary"
                      sx={{
                        borderRadius: 5,
                        fontSize: "25px",
                        width: "100%",
                        height: "auto",
                        backgroundColor: "rgba(0, 128, 255, 0.6)",
                        color: "white",
                        borderColor: "black",
                      }}
                      startIcon={
                        <SettingsIcon
                          style={{ fontSize: 48, marginRight: 15 }}
                        />
                      }
                    >
                      CONTRATAR Y CONFIGURAR
                    </Button>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          ))
        ) : (
          <Grid container item xs={12}>
            <Typography
              variant="h5"
              sx={{
                height: "100%",
                width: "100%",
                background: "rgba(0, 0, 0, 0.7)",
                color: "white",
                padding: "10px",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              No se encontraron DJS en esta área.
              <Button
                onClick={() => navigate("/usermaphome")}
                variant="outlined"
                color="primary"
                sx={{
                  ml: 5,
                  position: "absolute",
                  height: 40,
                  backgroundColor: "rgba(0, 128, 255, 0.6)",
                  color: "white",
                  borderColor: "black",
                }}
              >
                VOLVER
              </Button>
            </Typography>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default UserWelcome;
