import {DocumentType} from '@typegoose/typegoose';
import {OfferEntity} from '../modules/offer/offer.entity';

export interface FindResourceInterface {
  findById(resourceId: string): Promise<DocumentType<OfferEntity> | null>;
}
