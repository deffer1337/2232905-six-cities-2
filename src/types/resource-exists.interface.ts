export interface ResourceExistsInterface {
  exists(resourceId: string): Promise<boolean>;
}
