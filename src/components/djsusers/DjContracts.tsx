import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import NavbarUser from "./NavbarSuppliers";
import { eventTypes } from "../../model/EventTypes";
import { deleteContract } from "../../redux/reducers/ContractSlice";
import { RootState } from "../../model/RootStateTypes";
import { useNavigate } from "react-router-dom";

const ListContract: React.FC = () => {
  const navigate = useNavigate();
  const contracts = useSelector((state: RootState) => state.contract.contracts);
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const djUserEmail = user?.userEmail;

  console.log(djUserEmail);

  console.log(contracts);

  const dispatch = useDispatch();

  const userContracts = contracts.filter(
    (contract) => contract.DjEmail === djUserEmail
  );

  const [noContractsDialogOpen, setNoContractsDialogOpen] = useState(false);

  useEffect(() => {
    if (userContracts.length === 0) {
      setNoContractsDialogOpen(true);
    }
  }, [userContracts]);

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
            marginBottom: "5px",
            marginTop: "1px",
            width: "100%",
            height: "50px",
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            textAlign: "center",
            fontWeight: "bolder",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          !!! Hás sido contratado ¡¡¡
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          {userContracts.map((userContract, index) => {
            const contractDetails = userContract.contract;
            const currentContractId = userContract.ContractId;

            const selectedSongsForContract = contracts.find(
              (contract) => contract.ContractId === currentContractId
            )?.selectedSongs;

            return (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                {contractDetails.eventName && (
                  <Card
                    sx={{ background: "rgba(0, 0, 0, 0.8)", color: "white" }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          borderRadius: 2,
                          mt: -1,
                          mb: 1,
                          textAlign: "center",
                          background: "rgba(0, 0, 0, 0.7)",
                          color: "white",
                        }}
                      >
                        Contrato Para: {contractDetails.eventName}
                      </Typography>
                      <Avatar
                        alt={contractDetails.eventName}
                        sx={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 5,
                        }}
                        src={
                          eventTypes.find(
                            (eventType) =>
                              eventType.name === contractDetails.eventName
                          )?.image
                        }
                      />
                      <Typography
                        sx={{
                          borderRadius: "10px 10px 0px 0px",
                          textAlign: "center",
                          height: "30px",
                          backgroundColor: "rgba(0, 0, 0, 0.7)",
                          color: "white",
                          padding: "5px",
                          fontSize: "13px",
                        }}
                      >
                        {`Contratado Por: ${userContract.MusicUserEmail}`}
                      </Typography>
                      {contractDetails.djInfo && (
                        <Grid style={{ width: "100%", marginRight: "2px" }}>
                          <Avatar
                            alt={`${contractDetails.ClientFirstName} ${contractDetails.ClientLastName}`}
                            src={contractDetails.ClientImg}
                            style={{
                              width: "100%",
                              height: "auto",
                              borderRadius: "0px 0px 10px 10px",
                            }}
                          />
                        </Grid>
                      )}

                      <Grid sx={{ mt: 1 }}>
                        {contractDetails.warning && (
                          <Grid
                            container
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                              backgroundColor: "black",
                              color: "red",
                              borderRadius: "5px",
                              border: 1,
                              padding: "10px",
                              textAlign: "center",
                            }}
                          >
                            {contractDetails.warning && (
                              <Typography sx={{ fontSize: "13px" }}>
                                {contractDetails.warning}
                              </Typography>
                            )}
                          </Grid>
                        )}
                        <Typography>{`Cliente responsable: ${contractDetails.ClientFirstName} ${contractDetails.ClientLastName}`}</Typography>
                        <Typography>{`Dirección del evento: ${contractDetails.EventAddress}`}</Typography>
                        <Typography>{`Fecha del evento: ${contractDetails.EventDate}`}</Typography>
                        <Typography>{`Hora de inicio: ${contractDetails.startEventTime} Hs`}</Typography>
                        <Typography>{`Hora de finalización: ${contractDetails.endEventTime} Hs`}</Typography>
                        <Typography>{`Duración del evento: ${contractDetails.EventHours} Hs`}</Typography>
                        <Typography>{`Costo Total: ${contractDetails.totalCost}`}</Typography>
                      </Grid>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() =>
                          dispatch(
                            deleteContract({ email: userContract.email })
                          )
                        }
                        sx={{ mt: 2, width: "100%" }}
                      >
                        Eliminar Contrato
                      </Button>
                    </CardContent>

                    <div
                      style={{
                        marginBottom: 40,
                        marginTop: 2,
                        backgroundColor: "black",
                        color: "white",
                        borderRadius: "5px",
                        padding: "10px",
                        textAlign: "center",
                      }}
                    >
                      <Typography>Playlist del Usuario</Typography>
                    </div>

                    {selectedSongsForContract &&
                    selectedSongsForContract.length > 0 ? (
                      <List sx={{ mt: "-43px" }}>
                        {selectedSongsForContract.map(
                          (song: any, songIndex: number) => (
                            <ListItem
                              key={songIndex}
                              sx={{
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                borderRadius: 5,
                                mb: 1,
                              }}
                            >
                              <Typography>{`Artista: ${song.artists[0].name}`}</Typography>
                              <ListItemText
                                primary={`${songIndex + 1}: ${song.name}`}
                                sx={{ textAlign: "center", color: "white" }}
                              />
                            </ListItem>
                          )
                        )}
                      </List>
                    ) : (
                      <div
                        style={{
                          marginBottom: 40,
                          marginTop: -25,
                          backgroundColor: "red",
                          color: "white",
                          borderRadius: "5px",
                          padding: "10px",
                          textAlign: "center",
                        }}
                      >
                        <Typography>
                          No hay canciones seleccionadas aquí
                        </Typography>
                        <Typography>
                          "El evento dependerá de tu gusto musical"
                        </Typography>
                        <Typography>!!! A DARLE ¡¡¡</Typography>
                      </div>
                    )}
                  </Card>
                )}
              </Grid>
            );
          })}
        </Grid>

        <Dialog open={noContractsDialogOpen} fullWidth maxWidth="sm">
          <DialogTitle>No tienes contratos pendientes</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Parece que no tienes contratos pendientes en este momento.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => navigate("/supplierWelcome")}
              variant="contained"
              color="secondary"
              style={{ width: "200px" }}
            >
              Volver
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </div>
  );
};

export default ListContract;
