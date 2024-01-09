import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';
import {Component} from '../../types/component.enum.js';
import {Controller} from '../../core/controller/controller.abstract.js';
import {LoggerInterface} from '../../core/logger/logger.interface.js';
import {fillDTO} from '../../core/helpers/common.js';
import OfferDto from './dto/offer.dto';
import {StatusCodes} from 'http-status-codes';
import {HttpError} from '../../core/http/http.errors.js';
import {OfferServiceInterface} from './offer-service.interface.js';
import {HttpMethod} from '../../types/http.method.enum';
import {ParamsOffersCount} from './type/params-offer-count';
import {OfferLiteRdo} from './rdo/offerLite.rdo';
import {ExtendedRequestInterface} from '../../types/extended-request';

@injectable()
export default class OfferController extends Controller {
  constructor(@inject(Component.LoggerInterface) logger: LoggerInterface,
              @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/:offerId', method: HttpMethod.Get, handler: this.findById});
    this.addRoute({path: '/:offerId', method: HttpMethod.Put, handler: this.update});
    this.addRoute({path: '/:offerId', method: HttpMethod.Delete, handler: this.delete});
    this.addRoute({path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremium});
  }

  public async index({params}: Request<ParamsOffersCount>, res: Response): Promise<void> {
    const offerCount = params.count ? parseInt(`${params.count}`, 10) : undefined;
    const offers = await this.offerService.find(offerCount);
    this.ok(res, fillDTO(OfferLiteRdo, offers));
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, OfferDto>,
    res: Response
  ): Promise<void> {

    const result = await this.offerService.create(body);
    this.created(res, result);
  }

  public async findById({params}: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(`${params.offerId}`);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController',
      );
    }

    this.ok(res, offer);
  }

  public async update(req: ExtendedRequestInterface, res: Response): Promise<void> {
    const offer = await this.offerService.findById(`${req.params.offerId}`);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${req.params.offerId} not found.`,
        'OfferController',
      );
    }

    if (offer.userId.id !== req.user.id) {
      throw new HttpError(StatusCodes.FORBIDDEN,
        'Offer was created other user',
        'UpdateOffer');
    }

    const updatedOffer = await this.offerService.updateById(`${req.params.offerId}`, req.body);
    this.ok(res, updatedOffer);
  }

  public async delete(req: ExtendedRequestInterface, res: Response): Promise<void> {
    const offer = await this.offerService.findById(`${req.params.offerId}`);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${req.params.offerId} not found.`,
        'OfferController',
      );
    }

    if (offer.userId.id !== req.user.id) {
      throw new HttpError(StatusCodes.FORBIDDEN,
        'Offer was created other user',
        'UpdateOffer');
    }
    await this.offerService.deleteById(`${req.params.offerId}`);
    this.noContent(res, `Offer ${req.params.offerId} was deleted.`);
  }

  public async getPremium({params}: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const offer = await this.offerService.findPremiumByCity(`${params.city}`);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offers by city ${params.city} not found.`,
        'OfferController',
      );
    }

    this.ok(res, offer);
  }
}
