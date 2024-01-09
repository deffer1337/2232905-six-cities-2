import { inject, injectable } from 'inversify';
import {Request, Response} from 'express';
import {Component} from '../../types/component.enum.js';
import {Controller} from '../../core/controller/controller.abstract.js';
import {LoggerInterface} from '../../core/logger/logger.interface.js';
import {HttpMethod} from '../../types/http.method.enum.js';
import {fillDTO} from '../../core/helpers/common.js';
import {UserServiceInterface} from './user-service.interface.js';
import UserDto from './dto/user.dto';
import {HttpError} from '../../core/http/http.errors.js';
import {StatusCodes} from 'http-status-codes';
import {ConfigInterface} from '../../core/config/config.interface.js';
import {ConfigSchema} from '../../core/config/config.schema.js';
import UserRdo from './rdo/user.rdo.js';
import LoginUserDto from './dto/login-user.dto';
import {OfferLiteRdo} from '../offer/rdo/offerLite.rdo';
import {TokenServiceInterface} from '../../core/auth/token-service.interface';
import SignInUserRdo from './rdo/signin.user.rdo';
import {IssuedTokenServiceInterface} from "../token/token-service.interface";
import {ExtendedRequestInterface} from "../../types/extended-request";


@injectable()
export default class UserController extends Controller {
  constructor(@inject(Component.LoggerInterface) logger: LoggerInterface,
              @inject(Component.OfferServiceInterface) private readonly userService: UserServiceInterface,
              @inject(Component.ConfigInterface) private readonly configService: ConfigInterface<ConfigSchema>,
              @inject(Component.TokenServiceInterface) private readonly tokenService: TokenServiceInterface,
              @inject(Component.IssuedTokenServiceInterface) private readonly issuedTokenService: IssuedTokenServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for CategoryController…');

    this.addRoute({path: '/sign-up', method: HttpMethod.Get, handler: this.signUp});
    this.addRoute({path: '/sign-in', method: HttpMethod.Post, handler: this.signIn});
    this.addRoute({path: '/sign-out', method: HttpMethod.Post, handler: this.logout});
    this.addRoute({path: '/favorite/:offerId', method: HttpMethod.Post, handler: this.addFavorite});
    this.addRoute({path: '/favorite/:offerId', method: HttpMethod.Delete, handler: this.deleteFavorite});
    this.addRoute({path: '/favorite', method: HttpMethod.Get, handler: this.getFavorite});
  }

  public async signUp(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, UserDto>,
    res: Response): Promise<void> {
    const user = await this.userService.findByEmail(body.email);

    if (user) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${body.email} already exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async signIn({body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>, res: Response): Promise<void> {
    const user = await this
      .userService
      .verifyUser(body.email, body.password, this.configService.get('SALT'));

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController',
      );
    }

    const token = await this.tokenService.issueToken(
      this.configService.get('JWT_ALGORITHM'),
      this.configService.get('JWT_SECRET'),
      {
        email: user.email,
        id: user.id
      }
    );

    const rawToken = await this.tokenService.getRawToken(token)

    // @ts-ignore
    await this.issuedTokenService.issue(user.id, rawToken.exp, rawToken.jti)

    this.ok(res, {
      ...fillDTO(SignInUserRdo, user),
      token
    });
  }

  public async logout(req: ExtendedRequestInterface, res: Response): Promise<void> {
    const [, token] = String(req.headers.authorization?.split(' '));

    if (!req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }
    const rawToken = await this.tokenService.getRawToken(token)

    // @ts-ignore
    await this.issuedTokenService.revoke(rawToken.jti);

    this.noContent(res, {token});
  }

  public async getFavorite({body}: Request<Record<string, unknown>, Record<string, unknown>, {userId: string}>, _res: Response): Promise<void> {
    const result = await this.userService.findFavorites(body.userId);
    this.ok(_res, fillDTO(OfferLiteRdo, result));
  }

  public async addFavorite({body}: Request<Record<string, unknown>, Record<string, unknown>, {offerId: string, userId: string}>, res: Response): Promise<void> {
    await this.userService.addToFavoritesById(body.offerId, body.userId);
    this.noContent(res, {message: 'Предложение добавлено в избранное'});
  }

  public async deleteFavorite({body}: Request<Record<string, unknown>, Record<string, unknown>, {offerId: string, userId: string}>, res: Response): Promise<void> {
    await this.userService.removeFromFavoritesById(body.offerId, body.userId);
    this.noContent(res, {message: 'Предложение удалено из избранного'});
  }
}
