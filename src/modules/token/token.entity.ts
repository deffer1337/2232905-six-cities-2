import typegoose, {getModelForClass, Ref} from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;


@modelOptions({
  schemaOptions: {
    collection: 'issued_tokens'
  }
})
export class IssuedTokenEntity {
  @prop({
    type: () => String,
    required: true
  })
  public jti!: string;

  @prop({
    type: () => Boolean,
    default: false,
    required: true,
  })
  public revoked!: boolean;

  @prop({type: () => Date})
  public expiredAt!: Date;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;
}

export const IssuedTokenModel = getModelForClass(IssuedTokenEntity);
