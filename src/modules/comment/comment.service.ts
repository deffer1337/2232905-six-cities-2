import {inject, injectable} from 'inversify';
import {DocumentType, types} from '@typegoose/typegoose';
import {CommentServiceInterface} from './comment-service.interface.js';
import {Component} from '../../types/component.enum.js';
import {CommentEntity} from './comment.entity.js';
import CommentDto from './dto/comment.dto.js';
import {OfferServiceInterface} from '../offer/offer-service.interface.js';
import {SortType} from '../../types/sort-type.enum.js';

const COMMENTS_COUNT = 50;
@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface
  ) {
  }

  public async createForOffer(userId: string, offerId: string, dto: CommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create({...dto, offerId: offerId, userId: userId});
    await comment.populate('userId');
    await this.offerService.incComment(offerId);

    const comments = await this.findByOfferId(offerId);
    const offersCount = comments.length;
    const sumRating = comments.reduce((accumulator, current) => current.rating + accumulator, 0);
    const newRating = sumRating / offersCount;
    await this.offerService.updateRating(offerId, newRating);
    return comment;
  }


  public findById(commentId: string): Promise<DocumentType<CommentEntity> | null> {
    return this.commentModel
      .findById(commentId)
      .populate('userId')
      .exec();
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({offerId})
      .sort({publicationDate: SortType.Desc})
      .populate('userId')
      .limit(COMMENTS_COUNT)
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({offerId})
      .exec();

    return result.deletedCount;
  }
}
