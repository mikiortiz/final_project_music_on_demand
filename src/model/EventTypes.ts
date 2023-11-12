import Wedding from "/images/eventsImgs/Wedding.jpg";
import PartiesForChildren from "/images/eventsImgs/PartiesForChildren.jpg";
import BirthdayParties from "/images/eventsImgs/BirthdayParties.jpg";
import CorporateEvents from "/images/eventsImgs/CorporateEvents.jpg";
import SportsEvents from "/images/eventsImgs/SportsEvents.avif";
import Conserts from "/images/eventsImgs/Conserts.jpg";
import FashionImg from "/images/eventsImgs/FashionImg.jpg";
import CulturalImg from "/images/eventsImgs/CulturalImg.jpg";
import SocialMeetingsImg from "/images/eventsImgs/SocialMeetingsImg.jpg";
import CharityEvents from "/images/eventsImgs/CharityEvents.jpg";
import PartiesandFestivals from "/images/eventsImgs/PartiesandFestivals.jpg";
import ReligiousEvents from "/images/eventsImgs/ReligiousEvents.jpg";

export interface EventTypeContract {
  eventName: string;
  price: number;
  hours: number;
}

export const eventTypes = [
  { name: "Bodas", image: Wedding },
  { name: "Fiestas de Cumpleaños", image: BirthdayParties },
  { name: "Eventos Corporativos", image: CorporateEvents },
  { name: "Eventos Deportivos", image: SportsEvents },
  { name: "Conciertos", image: Conserts },
  { name: "Fiestas para Niños", image: PartiesForChildren },
  { name: "Eventos de Moda", image: FashionImg },
  { name: "Eventos Culturales", image: CulturalImg },
  { name: "Reuniones Sociales", image: SocialMeetingsImg },
  { name: "Eventos de Caridad", image: CharityEvents },
  { name: "Ferias y Festivales", image: PartiesandFestivals },
  { name: "Eventos Religiosos", image: ReligiousEvents },
];
