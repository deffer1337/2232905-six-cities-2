import {DocumentType} from '@typegoose/typegoose';
import CreateUserDto from './dto/user.dto';
import {UserEntity} from './user.entity.js';
import {OfferEntity} from '../offer/offer.entity';
import UserDto from './dto/user.dto';

export interface UserServiceInterface {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>
  addToFavoritesById(userId: string, offerId: string): Promise<void>;
  removeFromFavoritesById(userId: string, offerId: string): Promise<void>;
  verifyUser(email: string, password: string, salt: string): Promise<DocumentType<UserEntity> | null>;
  updateById(userId: string, dto: UserDto): Promise<DocumentType<UserEntity> | null>
}
