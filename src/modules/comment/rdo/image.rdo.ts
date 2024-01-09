import { Expose } from 'class-transformer';

export default class ImageRdo {
  @Expose()
  public image!: string;
}
