import { Expose } from 'class-transformer';
import {CityEnum} from '../../../types/city.enum.js';
import {HouseType} from '../../../types/house-type.enum.js';

export class OfferLiteRdo {
  @Expose()
  public id!: string;

  @Expose()
    name!: string;

  @Expose()
    publicationDate!: Date;

  @Expose()
    city!: CityEnum;

  @Expose()
    previewImage!: string;

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
}
