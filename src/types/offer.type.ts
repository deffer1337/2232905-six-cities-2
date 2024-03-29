import {UserType} from './user.type.js';
import {CityEnum} from './city.enum';
import {HouseType} from './house-type.enum';
import {Facilities} from './facilities.enum';
import {CoordinatesType} from './coordinates.type';


export type OfferType = {
  name: string;
  description: string;
  publicationDate: Date;
  city: CityEnum;
  previewImage: string;
  images: string[];
  premium: boolean;
  favorite: boolean;
  rating: number;
  houseType: HouseType;
  roomCount: number;
  guestCount: number;
  cost: number;
  facilities: Facilities[];
  offerAuthor: UserType;
  commentsCount: number;
  coordinates: CoordinatesType
}
