import {Expose, Type} from 'class-transformer';
import {CityEnum} from '../../../types/city.enum.js';
import {HouseType} from '../../../types/house-type.enum.js';
import {Facilities} from '../../../types/facilities.enum.js';
import {UserType} from '../../../types/user.type.js';
import {CoordinatesType} from '../../../types/coordinates.type.js';
import UserRdo from '../../user/rdo/user.rdo.js';

export class OfferRdo {
  @Expose()
  public id!: string;

  @Expose()
    name!: string;

  @Expose()
    publicationDate!: Date;

  @Expose()
    description!: string;

  @Expose()
    city!: CityEnum;

  @Expose()
    previewImage!: string;

  @Expose()
    images!: string[];

  @Expose()
    isPremium!: boolean;

  @Expose()
    isFavorite!: boolean;

  @Expose()
    rating!: number;

  @Expose()
    houseType!: HouseType;

  @Expose()
    cost!: number;

  @Expose()
    commentsCount!: number;

  @Expose()
    roomCount!: number;

  @Expose()
    guestCount!: number;

  @Expose()
    facilities!: Facilities[];

  @Expose({name: 'userId'})
  @Type(() => UserRdo)
    author!: UserType;

  @Expose()
    coordinates!: CoordinatesType;
}
