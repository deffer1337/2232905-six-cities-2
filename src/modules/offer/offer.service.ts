import {inject, injectable} from 'inversify';
import OfferDto from './dto/offer.dto';
import {DocumentType, types} from '@typegoose/typegoose';
import {OfferEntity} from './offer.entity.js';
import {OfferServiceInterface} from './offer-service.interface.js';
import {Component} from '../../types/component.enum.js';
import {MAX_OFFERS_COUNT, MAX_PREMIUM_OFFERS_COUNT} from '../../core/helpers/consts.js';
import {SortType} from '../../types/sort-type.enum.js';


@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {
  }

  public async create(userId: string, dto: OfferDto): Promise<DocumentType<OfferEntity>> {
    const offer = await this.offerModel.create({...dto, userId: userId});
    await offer.populate('userId');
    return offer;
  }

  public async findById(resourceId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(resourceId)
      .populate('userId')
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async find(count: number | undefined): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? MAX_OFFERS_COUNT;
    return this.offerModel
      .find()
      .sort({publicationDate: SortType.Desc})
      .populate('userId')
      .limit(limit)
      .exec();
  }

  public async findPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({city: city, isPremium: true})
      .sort({createdAt: SortType.Desc})
      .limit(MAX_PREMIUM_OFFERS_COUNT)
      .populate('userId')
      .exec();
  }

  public async incComment(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId,
        {
          '$inc': {
            commentsCount: 1,
          }
        }
      ).exec();
  }

  public async updateById(offerId: string, dto: OfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .populate('userId')
      .exec();
  }

  public async updateRating(offerId: string, rating: number): Promise<void> {
    await this.offerModel
      .findByIdAndUpdate(offerId, {rating: rating}, {new: true})
      .exec();
  }

  public async exists(resourceId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({_id: resourceId})) !== null;
  }

  public async addImage(offerId: string, image: string): Promise<void> {
    await this.offerModel
      .updateOne({_id: offerId}, {$addToSet: {images: image}});
  }

  public async removeImage(offerId: string, image: string): Promise<void> {
    await this.offerModel
      .updateOne({_id: offerId}, {$pull: {images: image}});
  }
}
