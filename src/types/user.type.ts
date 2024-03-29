import {UserTypeEnum} from './user-type.enum';

export type UserType = {
  username: string;
  email: string;
  avatar?: string;
  type: UserTypeEnum;
}
