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
} from "@mui/material";
import NavbarUser from "./NavbarUsers";
import { eventTypes } from "../../model/EventTypes";
import { deleteContract } from "../../redux/reducers/ContractSlice";
import { RootState } from "../../model/RootStateTypes";
import { useNavigate } from "react-router-dom";

const ListContract: React.FC = () => {
  const navigate = useNavigate();
  const contracts = useSelector((state: RootState) => state.contract.contracts);
  const musicUserEmail = useSelector(
    (state: RootState) => state.userLogin.user?.userEmail
  );

  const selectedsong = useSelector(
    (state: RootState) => state.contract.contracts
  );

  const dispatch = useDispatch();

  const userContracts = contracts.filter(
    (contract) => contract.MusicUserEmail === musicUserEmail
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
          Mis Contratos
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          {userContracts.map((userContract, index) => {
            const contractDetails = userContract.contract;
            const currentContractId = userContract.ContractId;

            // Filtrar las canciones seleccionadas para el contrato actual
            const selectedSongsForContract = selectedsong.find(
              (contract) => contract.ContractId === currentContractId
            )?.selectedSongs;

            return (
              <Grid item key={index} xs={12} sm={6} md={6} lg={6}>
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
                        Contrato De: {contractDetails.eventName}
                      </Typography>
                      <Grid container>
                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={6}
                          style={{ position: "relative" }}
                        >
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
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={6}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                          }}
                        >
                          {contractDetails.djInfo && (
                            <Grid style={{ width: "90%", marginRight: "5%" }}>
                              <Typography
                                sx={{
                                  borderRadius: "10px 10px 0px 0px",
                                  textAlign: "center",
                                  height: "30px",
                                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                                  color: "white",
                                  padding: "5px",
                                  fontSize: "20px",
                                }}
                              >
                                {`DJ: ${contractDetails.djInfo.DjFirstName} ${contractDetails.djInfo.DjLastName}`}
                              </Typography>
                              <Avatar
                                alt={`${contractDetails.djInfo.DjFirstName} ${contractDetails.djInfo.DjLastName}`}
                                src={contractDetails.djInfo.DjImg}
                                style={{
                                  width: "100%",
                                  height: "auto",
                                  borderRadius: "0px 0px 10px 10px",
                                }}
                              />
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                      <Grid sx={{ mt: 1 }}>
                        <Typography>{`Fecha del evento: ${contractDetails.EventDate}`}</Typography>
                        <Typography>{`Dirección del evento: ${contractDetails.EventAddress}`}</Typography>
                        <Typography>{`Duración del evento: ${contractDetails.EventHours} horas`}</Typography>
                        <Typography>{`Cliente responsable: ${contractDetails.ClientFirstName} ${contractDetails.ClientLastName}`}</Typography>
                        <Typography>{`Costo Total: ${contractDetails.totalCost}`}</Typography>

                        {selectedSongsForContract &&
                        selectedSongsForContract.length > 0 ? (
                          <div>
                            {selectedSongsForContract.map(
                              (song: any, songIndex: number) => (
                                <Typography key={songIndex}>
                                  Canción {songIndex + 1}: {song.name}
                                </Typography>
                              )
                            )}
                          </div>
                        ) : (
                          <div>
                            <Typography>
                              No hay canciones seleccionadas
                            </Typography>
                          </div>
                        )}
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
                    <Button
                      onClick={() =>
                        navigate("/configurationplaylist", {
                          state: { ContractId: userContract.ContractId },
                        })
                      }
                      variant="outlined"
                      color="primary"
                      sx={{
                        mb: 5,
                        mt: 1,
                        borderRadius: 5,
                        fontSize: "25px",
                        width: "100%",
                        height: "auto",
                        backgroundColor: "rgba(0, 128, 255, 0.6)",
                        color: "white",
                        borderColor: "black",
                      }}
                    >
                      CONFIGURAR MIS PLAYLISTS
                    </Button>
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
              onClick={() => navigate("/userwelcome")}
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
