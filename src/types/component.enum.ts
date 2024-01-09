export const Component = {
  RestApplication: Symbol.for('RestApplication'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DBClientInterface: Symbol.for('DBClientInterface'),
  UserServiceInterface: Symbol.for('UserServiceInterface'),
  UserModel: Symbol.for('UserModel'),
  CoordinatesServiceInterface: Symbol.for('CoordinatesServiceInterface'),
  CoordinatesModel: Symbol.for('CoordinatesModel'),
  OfferServiceInterface: Symbol.for('OfferServiceInterface'),
  OfferModel: Symbol.for('OfferModel'),
  CommentServiceInterface: Symbol.for('CommentServiceInterface'),
  CommentModel: Symbol.for('CommentModel'),
  ExceptionFilter: Symbol.for('ExceptionFilter'),
  OfferController: Symbol.for('OfferController'),
  UserController: Symbol.for('UserController'),
  TokenServiceInterface: Symbol.for('TokenServiceInterface')
} as const;
