import {OfferType} from '../../types/offer.type.js';
import {HouseType} from '../../types/house-type.enum.js';
import {Facilities} from '../../types/facilities.enum.js';
import {UserTypeEnum} from '../../types/user-type.enum.js';
import {CityEnum} from '../../types/city.enum.js';
export function createOffer(offer: string): OfferType {
  const offerRow = offer.replace('\n', '').split('\t');
  const [name,
    description,
    publicationDate,
    city,
    previewImage,
    images,
    premium,
    favorite,
    rating,
    housingType,
    roomCount,
    guestCount,
    cost,
    facilities,
    offerAuthorName,
    offerAuthorAvatar,
    offerAuthorType,
    offerAuthorEmail,
    commentsCount,
    latitude,
    longitude] = offerRow;
  return {
    name: name,
    description: description,
    publicationDate: new Date(publicationDate),
    city: city as unknown as CityEnum,
    previewImage: previewImage,
    images: images.split(','),
    premium: premium as unknown as boolean,
    favorite: favorite as unknown as boolean,
    rating: parseFloat(rating),
    houseType: housingType as unknown as HouseType,
    roomCount: parseInt(roomCount, 10),
    guestCount: parseInt(guestCount, 10),
    cost: parseInt(cost, 10),
    facilities: facilities.split(',').map((x) => x as unknown as Facilities),
    offerAuthor: {
      username: offerAuthorName,
      avatar: offerAuthorAvatar,
      type: offerAuthorType as unknown as UserTypeEnum,
      email: offerAuthorEmail,
    },
    commentsCount: parseInt(commentsCount, 10),
    coordinates: {latitude: parseFloat(latitude), longitude: parseFloat(longitude)}
  };
}
