import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';
import {Component} from '../../types/component.enum.js';
import {Controller} from '../../core/controller/controller.abstract.js';
import {LoggerInterface} from '../../core/logger/logger.interface.js';
import {fillDTO} from '../../core/helpers/common.js';
import OfferDto from './dto/offer.dto.js';
import {OfferServiceInterface} from './offer-service.interface.js';
import {HttpMethod} from '../../types/http.method.enum.js';
import {ParamsOffersCount} from './type/params-offer-count.type.js';
import {OfferLiteRdo} from './rdo/offerLite.rdo.js';
import {ExtendedRequestInterface} from '../../types/extended-request.js';
import {CheckUserAuthMiddleware} from '../../core/middlewares/check-user-auth.middleware.js';
import {ValidateDTOMiddleware} from '../../core/middlewares/validate-dto.middleware.js';
import {ValidateObjectIdMiddleware} from '../../core/middlewares/validate-object-id.midlleware.js';
import {ResourceExistsMiddleware} from '../../core/middlewares/resource-exists.middleware.js';
import {CheckUserAccessToResourceMiddleware} from '../../core/middlewares/check-user-access-to-resource.middleware.js';
import {CommentServiceInterface} from '../comment/comment-service.interface.js';
import CommentRdo from '../comment/rdo/comment.rdo.js';
import CommentDto from '../comment/dto/comment.dto.js';
import {ParamsCity} from './type/params-city.type.js';
import {UserServiceInterface} from '../user/user-service.interface.js';
import {UploadFileMiddleware} from '../../core/middlewares/upload-file.middleware.js';
import {ConfigInterface} from '../../core/config/config.interface.js';
import {ConfigSchema} from '../../core/config/config.schema.js';
import ImageRdo from '../comment/rdo/image.rdo.js';
import {OfferRdo} from './rdo/offer.rdo.js';

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(Component.ConfigInterface) private readonly configService: ConfigInterface<ConfigSchema>,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new CheckUserAuthMiddleware(),
        new ValidateDTOMiddleware(OfferDto)
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ResourceExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Put,
      handler: this.update,
      middlewares: [
        new CheckUserAuthMiddleware(),
        new CheckUserAccessToResourceMiddleware(this.offerService, 'offerId'),
        new ValidateObjectIdMiddleware('offerId'),
        new ResourceExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new ValidateDTOMiddleware(OfferDto),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new CheckUserAuthMiddleware(),
        new CheckUserAccessToResourceMiddleware(this.offerService, 'offerId'),
        new ValidateObjectIdMiddleware('offerId'),
        new ResourceExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Post,
      handler: this.createComment,
      middlewares: [
        new CheckUserAuthMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ResourceExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new ValidateDTOMiddleware(CommentDto),
      ]
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ResourceExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/premium/:city',
      method: HttpMethod.Get,
      handler: this.showPremium
    });
    this.addRoute({
      path: '/:offerId/favorites',
      method: HttpMethod.Post,
      handler: this.addFavorite,
      middlewares: [
        new CheckUserAuthMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ResourceExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId/favorites',
      method: HttpMethod.Delete,
      handler: this.deleteFavorite,
      middlewares: [
        new CheckUserAuthMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ResourceExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/users/favorites',
      method: HttpMethod.Get,
      handler: this.showFavorites,
      middlewares:[
        new CheckUserAuthMiddleware()
      ]
    });
    this.addRoute({
      path: '/:offerId/preview-image',
      method: HttpMethod.Post,
      handler: this.uploadPreviewImage,
      middlewares: [
        new CheckUserAuthMiddleware(),
        new CheckUserAccessToResourceMiddleware(this.offerService, 'offerId'),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'previewImage'),
      ]
    });
    this.addRoute({
      path: '/:offerId/image',
      method: HttpMethod.Post,
      handler: this.uploadImage,
      middlewares: [
        new CheckUserAuthMiddleware(),
        new CheckUserAccessToResourceMiddleware(this.offerService, 'offerId'),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'image'),
      ]
    });
    this.addRoute({
      path: '/:offerId/image/:filename',
      method: HttpMethod.Delete,
      handler: this.removeImage,
      middlewares: [
        new CheckUserAuthMiddleware(),
        new CheckUserAccessToResourceMiddleware(this.offerService, 'offerId'),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'image'),
      ]
    });
  }

  public async index({params}: Request<ParamsOffersCount>, res: Response): Promise<void> {
    const offerCount = params.count ? parseInt(`${params.count}`, 10) : undefined;
    const offers = await this.offerService.find(offerCount);
    this.ok(res, fillDTO(OfferLiteRdo, offers));
  }

  public async create(
    { body , user}: ExtendedRequestInterface,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create(user.id, body);
    this.created(res, fillDTO(OfferRdo, result));
  }

  public async show({params}: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(`${params.offerId}`);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async update(req: ExtendedRequestInterface, res: Response): Promise<void> {
    const updatedOffer = await this.offerService.updateById(`${req.params.offerId}`, req.body);
    this.ok(res, fillDTO(OfferRdo,updatedOffer));
  }

  public async delete(req: ExtendedRequestInterface, res: Response): Promise<void> {
    await this.offerService.deleteById(`${req.params.offerId}`);
    this.noContent(res, `Offer ${req.params.offerId} was deleted.`);
  }

  public async createComment({body, params, user}: ExtendedRequestInterface, res: Response): Promise<void> {
    const comment = await this.commentService.createForOffer(
      user.id,
      params.offerId,
      body,
    );
    this.created(res, fillDTO(CommentRdo, comment));
  }

  public async getComments({params}: Request, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async showPremium({params}: Request<ParamsCity>, res: Response): Promise<void> {
    const offers = await this.offerService.findPremiumByCity(params.city);
    this.ok(res, fillDTO(OfferLiteRdo, offers));
  }

  public async addFavorite({ params, user }: ExtendedRequestInterface, res: Response): Promise<void> {
    await this.userService.addToFavoritesById(user.id, params.offerId);
    this.noContent(res, {message: 'Offer was added to favorite'});
  }

  public async deleteFavorite({ params, user }: ExtendedRequestInterface, res: Response): Promise<void> {
    await this.userService.removeFromFavoritesById(user.id, params.offerId);
    this.noContent(res, {message: 'Offer was removed from favorite'});
  }

  public async showFavorites({user}: ExtendedRequestInterface, _res: Response): Promise<void> {
    const offers = await this.userService.findFavorites(user.id);
    this.ok(_res, fillDTO(OfferLiteRdo, offers));
  }

  public async uploadPreviewImage(req: Request, res: Response) {
    const {offerId} = req.params;
    const updateDto = { previewImage: req.file?.filename };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await this.offerService.updateById(offerId, updateDto);
    this.created(res, fillDTO(ImageRdo, {updateDto}));
  }

  public async uploadImage(req: Request, res: Response) {
    const {offerId} = req.params;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await this.offerService.addImage(offerId, req.file?.filename);
    this.noContent(res, 'Image was added');
  }

  public async removeImage(req: Request, res: Response) {
    // For the sake of time efficiency in the educational project, the file storage implementation is structured as follows.
    // In a real-world project, it is necessary to store both the fileId and the actual content.
    // Consequently, for file deletion, the fileId will be passed accordingly.
    const {offerId, filename} = req.params;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await this.offerService.removeImage(offerId, filename);
    this.noContent(res, 'Image was removed');
  }
}
