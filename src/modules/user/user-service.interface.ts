import {DocumentType} from '@typegoose/typegoose';
import CreateUserDto from './dto/user.dto';
import {UserEntity} from './user.entity.js';
import {OfferEntity} from '../offer/offer.entity';

export interface UserServiceInterface {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>
  addToFavoritesById(userId: string, offerId: string): Promise<DocumentType<OfferEntity>[] | null>;
  removeFromFavoritesById(userId: string, offerId: string): Promise<DocumentType<OfferEntity>[] | null>;
  verifyUser(email: string, password: string, salt: string): Promise<DocumentType<UserEntity> | null>;
}
