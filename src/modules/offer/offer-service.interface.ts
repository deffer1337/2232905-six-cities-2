import {DocumentType} from '@typegoose/typegoose';
import {OfferEntity} from './offer.entity.js';
import OfferDto from './dto/offer.dto';
import {ResourceExistsInterface} from '../../types/resource-exists.interface';
import {FindResourceInterface} from '../../types/find-resource.interface';

export interface OfferServiceInterface extends ResourceExistsInterface, FindResourceInterface{
  create(userId: string, dto: OfferDto): Promise<DocumentType<OfferEntity>>;
  findById(resourceId: string): Promise<DocumentType<OfferEntity> | null>;
  find(count: number | undefined): Promise<DocumentType<OfferEntity>[]>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: OfferDto): Promise<DocumentType<OfferEntity> | null>;
  findPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]>;
  incComment(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateRating(offerId: string, rating: number): Promise<void>
  addImage(offerId: string, image: string): Promise<void>
  removeImage(offerId: string, image: string): Promise<void>

}
