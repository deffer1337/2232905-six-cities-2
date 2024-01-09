import { Expose } from 'class-transformer';

export default class SignInUserRdo {
  @Expose()
  public token!: string;

  @Expose()
  public email!: string;
}
