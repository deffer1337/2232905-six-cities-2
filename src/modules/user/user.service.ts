import {UserEntity} from './user.entity.js';
import {DocumentType} from '@typegoose/typegoose/lib/types.js';
import CreateUserDto from './dto/user.dto';
import {UserServiceInterface} from './user-service.interface.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/component.enum.js';
import {types} from '@typegoose/typegoose';
import {LoggerInterface} from '../../core/logger/logger.interface';
import {OfferEntity} from '../offer/offer.entity';
import UserDto from './dto/user.dto';

@injectable()
export default class UserService implements UserServiceInterface {

  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {
  }

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created with: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.userModel.findById(userId).select('favorites');
    if (!offers) {
      return [];
    }

    return this.offerModel
      .find({_id: { $in: offers }}).populate('userId');
  }

  public async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({'_id': userId});
  }

  public async addToFavoritesById(userId: string, offerId: string): Promise<void> {
    await this.userModel.updateOne(
      {_id: userId},
      { $addToSet: { favorite: offerId } }
    );
  }

  public async removeFromFavoritesById(userId: string, offerId: string): Promise<void> {
    await this.userModel.updateOne(
      {_id: userId},
      { $pull: { favorite: offerId } }
    );
  }

  public async verifyUser(email: string, password: string, salt: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(email);
    if (user?.verifyPassword(password, salt)) {
      return user;
    } else {
      return null;
    }
  }

  public async updateById(userId: string, dto: UserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, dto, {new: true})
      .exec();
  }
}
