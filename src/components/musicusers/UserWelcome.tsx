import { useSelector } from "react-redux";
import { RootState } from "../../model/RootStateTypes";
import { SupplierData } from "../../model/SupplierData";
import NavbarUser from "./NavbarUsers";

const UserWelcome = () => {
  const musicUser = useSelector(
    (state: RootState) => state.registered.MusicUsers
  );
  const djUsers = useSelector((state: RootState) => state.registered.DjsUsers);

  if (!musicUser || !musicUser[0]?.area || !musicUser[0]?.area) {
    return <p>No se encontraron DJs coincidentes.</p>;
  }

  const musicUserLat = parseFloat(musicUser[0].area[0]?.lat);
  const musicUserLng = parseFloat(musicUser[0].area[0]?.lng);

  const matchingDjs = djUsers.filter((djUser: SupplierData) => {
    if (djUser?.areas) {
      // Iterar sobre todas las áreas del DjUser
      for (const djArea of djUser.areas) {
        const djLat = parseFloat(djArea.lat);
        const djLng = parseFloat(djArea.lng);
        const djRadius = djArea.radius ?? 0;

        const calculateDistance = (
          djLat: number,
          y1: number,
          x2: number,
          y2: number
        ) => {
          return Math.sqrt(Math.pow(x2 - djLat, 2) + Math.pow(y2 - y1, 2));
        };

        const distance = calculateDistance(
          djLat,
          djLng,
          musicUserLat,
          musicUserLng
        );

        // Verificar si la distancia está dentro del radio especificado por el DJ
        if (distance <= djRadius) {
          return true;
        }
      }
    }

    return false;
  });

  return (
    <div>
      <NavbarUser />
      {matchingDjs.length > 0 ? (
        matchingDjs.map((djUser) => (
          <div key={djUser.userEmail}>
            <h2>
              {djUser.userFirstName} {djUser.userLastName}
            </h2>
            <p>Email: {djUser.userEmail}</p>
            {/* Renderiza más información del DJ aquí según sea necesario */}
          </div>
        ))
      ) : (
        <p>No se encontraron DJs coincidentes.</p>
      )}
      {/* Aquí puedes agregar más contenido de tu aplicación */}
    </div>
  );
};

export default UserWelcome;
