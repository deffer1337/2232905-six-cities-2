import {DocumentType} from '@typegoose/typegoose/lib/types.js';
import CommentDto from './dto/comment.dto';
import {CommentEntity} from './comment.entity.js';

export interface CommentServiceInterface {
  createForOffer(userId: string, offerId: string, dto: CommentDto): Promise<DocumentType<CommentEntity>>;
  findById(commentId: string): Promise<DocumentType<CommentEntity> | null>
  deleteByOfferId(offerId: string): Promise<number | null>;
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>
}
