import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../model/RootStateTypes";
import GoogleMapReact from "google-map-react";
import { addArea } from "../../redux/reducers/RegisteredFormSlice";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Area } from "../../model/SupplierData";
import { removeArea } from "../../redux/reducers/RegisteredFormSlice";
import Navbar from "./NavbarSuppliers";
import {
  Card,
  CardContent,
  Grid,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { enqueueSnackbar } from "notistack";

const DjAreas = () => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const dispatch = useDispatch();

  const userEmail = useSelector(
    (state: RootState) => state.userLogin.user?.userEmail
  );

  const areas = useSelector((state: RootState) => {
    const user = state.registered.DjsUsers.find(
      (user) => user.userEmail === userEmail
    );
    return user ? user.areas : [];
  });

  const defaultCenter = {
    lat: -33.58101234209427,
    lng: -69.0172903733438,
  };

  const [circle, setCircle] = useState<google.maps.Circle | null>(null);
  const [areaName, setAreaName] = useState<string>("");
  const [isAreaWindowOpen, setIsAreaWindowOpen] = useState(false);
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (circle && mapRef.current) {
      const circleCenter = circle.getCenter();
      (mapRef.current as google.maps.Map).panTo({
        lat: circleCenter.lat(),
        lng: circleCenter.lng(),
      });
    }
  }, [circle]);

  const handleSaveArea = () => {
    if (circle && areaName.trim() !== "") {
      const radius = circle.getRadius();
      const center = {
        lat: circle.getCenter().lat(),
        lng: circle.getCenter().lng(),
      };

      enqueueSnackbar("Área guardada exitosamente.", {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        style: { backgroundColor: "black" },
      });

      const newArea: Area = {
        name: areaName,
        lat: center.lat.toString(),
        lng: center.lng.toString(),
        radius: radius,
      };

      // Despachamos la acción addArea con el email del usuario y el área definida
      if (userEmail) {
        dispatch(
          addArea({
            email: userEmail,
            area: newArea,
          })
        );

        setAreaName("");
      }
    } else {
      console.log("Nombre del área o círculo no válido");
    }
  };

  const maprender = (map: any, maps: any) => {
    const newCircle = new maps.Circle({
      strokeColor: "#000000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#000000",
      fillOpacity: 0.35,
      editable: true,
      draggable: true,
      map,
      center: defaultCenter,
      radius: 15000,
    });

    setCircle(newCircle);

    map.addListener("click", (e: any) => {
      // Obtiengo las coordenadas donde se hizo clic
      const clickedLocation = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };

      newCircle.setCenter(clickedLocation);

      map.panTo(clickedLocation);
    });
  };

  const handleDeleteArea = (areaToDelete: Area) => {
    dispatch(removeArea({ email: userEmail, area: areaToDelete }));
  };

  const handleGoToArea = (area: Area) => {
    console.log("Ir a área:", area);
    setIsAreaWindowOpen(false);

    //Ubicación del área seleccionada y establecemos el radio
    const newCenter = new google.maps.LatLng(
      parseFloat(area.lat),
      parseFloat(area.lng)
    );
    circle?.setCenter(newCenter);
    circle?.setRadius(area.radius);

    //Referencia del mapa está llegando correctamente
    console.log("Referencia del mapa:", googleMap);

    // Centra el mapa en la ubicación del área seleccionada
    googleMap?.panTo(newCenter);
  };

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
      }}
    >
      <Grid
        zIndex={1}
        item
        xs={12}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <Navbar />
        <Typography
          variant="h4"
          sx={{
            height: "45px",
            backgroundColor: "black",
            color: "white",
            fontWeight: "600",
            fontSize: 30,
            textAlign: "center",
            mt: "1px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ÁREAS DE SERVICIO
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
          "En esta sección, tienes el control total para definir tus áreas de
          trabajo, personaliza las áreas según tus necesidades y posibilidades.
          Desde pequeños escenarios hasta grandes espacios al aire libre,
          Establece tus propios límites, elige las áreas que mejor se adapten a
          tu estilo y crea experiencias únicas para tus oyentes. ¡Tu música, tus
          reglas, tus áreas!"
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyBfjO7sxd8P6HDrF1lmvLV151z7ocauPD0" }}
          defaultCenter={defaultCenter}
          defaultZoom={8}
          yesIWantToUseGoogleMapApiInternals
          options={{
            disableDefaultUI: true,
          }}
          onGoogleApiLoaded={({ map, maps }) => {
            setGoogleMap(map);

            maprender(map, maps);
          }}
        ></GoogleMapReact>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          style={{
            position: "absolute",
            top: "35%",
            right: 0,
            zIndex: 2,
          }}
        >
          <Card style={{ background: "rgba(0, 0, 0, 0.7)" }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="off"
                    variant="filled"
                    label="Nombre de Área Seleccionada"
                    margin="normal"
                    fullWidth
                    value={areaName}
                    onChange={(e) => setAreaName(e.target.value)}
                    style={{
                      marginTop: 0,
                      backgroundColor: "lightgray",
                      color: "black",
                      borderRadius: 5,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleSaveArea}
                    fullWidth
                    sx={{
                      mt: -1,
                      backgroundColor: "rgba(0, 128, 255, 0.5)",
                      color: "white",
                      borderColor: "black",
                    }}
                  >
                    Guardar Área
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
            <Grid item xs={12}>
              <Button
                onClick={() => setIsAreaWindowOpen(true)}
                variant="outlined"
                color="primary"
                sx={{
                  width: "92%",
                  ml: 2,
                  mb: 2,
                  backgroundColor: "rgba(0, 128, 255, 0.5)",
                  color: "white",
                  borderColor: "black",
                }}
              >
                Mis Areas
              </Button>
            </Grid>
            {/* Ventana de áreas */}
            {isAreaWindowOpen && (
              <Grid container item xs={12}>
                <Card
                  style={{
                    background: "rgba(0, 0, 0, 0.8)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    borderRadius: "10px",
                    color: "white",
                    width: "50%",
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 9999,
                    maxHeight: "80%",
                    overflowY: "auto",
                  }}
                >
                  <CardContent>
                    <Grid container>
                      <Typography
                        variant="h5"
                        sx={{
                          textAlign: "center",
                          background: "rgba(0, 0, 0, 0.8)",
                          width: "100%",
                          height: "50px",
                          borderRadius: 2,
                          mb: "15px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          maxHeight: "50px",
                          overflow: "auto",
                        }}
                      >
                        Mis Áreas
                      </Typography>
                    </Grid>

                    {/* Lista de áreas seleccionadas */}
                    <List style={{ maxHeight: "200px", overflowY: "auto" }}>
                      {areas?.map((area, index) => (
                        <ListItem key={index}>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            style={{
                              marginTop: -10,
                              width: "auto",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "revert-layer",
                              background: "rgba(0, 0, 0, 0.8)",
                              height: 60,
                              borderRadius: 2,
                              padding: "0 8px",
                            }}
                          >
                            <Grid>
                              <Button
                                onClick={() => handleGoToArea(area)}
                                color="primary"
                                sx={{
                                  minWidth: "unset",
                                  backgroundColor: "rgba(0, 128, 255, 0.5)",
                                  color: "white",
                                }}
                              >
                                Ir
                              </Button>
                            </Grid>
                            <Grid style={{ textAlign: "center", flex: 1 }}>
                              {area.name}
                            </Grid>
                            <Grid
                              container
                              sx={{
                                width: "auto",
                                bgcolor: "blueviolet",
                                borderRadius: 2,
                              }}
                            >
                              <IconButton
                                sx={{ color: "white", height: "auto" }}
                                aria-label="Eliminar"
                                onClick={() => handleDeleteArea(area)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </ListItem>
                      ))}
                    </List>

                    <Grid container>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => setIsAreaWindowOpen(false)}
                        color="secondary"
                        style={{
                          margin: "auto",
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        Cerrar
                      </Button>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DjAreas;
