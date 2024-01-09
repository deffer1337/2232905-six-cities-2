import { Expose } from 'class-transformer';

export default class AvatarRdo {
  @Expose()
  public avatar!: string;
}
