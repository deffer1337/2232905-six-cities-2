import { inject, injectable } from 'inversify';
import {Request, Response} from 'express';
import {Component} from '../../types/component.enum.js';
import {Controller} from '../../core/controller/controller.abstract.js';
import {LoggerInterface} from '../../core/logger/logger.interface.js';
import {HttpMethod} from '../../types/http.method.enum.js';
import {fillDTO} from '../../core/helpers/common.js';
import {UserServiceInterface} from './user-service.interface.js';
import UserDto from './dto/user.dto.js';
import {HttpError} from '../../core/http/http.errors.js';
import {StatusCodes} from 'http-status-codes';
import {ConfigInterface} from '../../core/config/config.interface.js';
import {ConfigSchema} from '../../core/config/config.schema.js';
import UserRdo from './rdo/user.rdo.js';
import LoginUserDto from './dto/login-user.dto.js';
import {TokenServiceInterface} from '../../core/auth/token-service.interface.js';
import SignInUserRdo from './rdo/signin.user.rdo.js';
import {IssuedTokenServiceInterface} from '../token/token-service.interface.js';
import {ExtendedRequestInterface} from '../../types/extended-request.js';
import {ValidateDTOMiddleware} from '../../core/middlewares/validate-dto.middleware.js';
import {CheckUserAuthMiddleware} from '../../core/middlewares/check-user-auth.middleware.js';
import {ValidateObjectIdMiddleware} from '../../core/middlewares/validate-object-id.midlleware.js';
import {UploadFileMiddleware} from '../../core/middlewares/upload-file.middleware.js';
import AvatarRdo from './rdo/avatar.rdo.js';


@injectable()
export default class UserController extends Controller {
  constructor(@inject(Component.LoggerInterface) logger: LoggerInterface,
              @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
              @inject(Component.ConfigInterface) private readonly configService: ConfigInterface<ConfigSchema>,
              @inject(Component.TokenServiceInterface) private readonly tokenService: TokenServiceInterface,
              @inject(Component.IssuedTokenServiceInterface) private readonly issuedTokenService: IssuedTokenServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/sign-up',
      method: HttpMethod.Post,
      handler: this.signUp,
      middlewares: [
        new ValidateDTOMiddleware(UserDto),
      ]
    });
    this.addRoute({
      path: '/sign-in',
      method: HttpMethod.Post,
      handler: this.signIn,
      middlewares: [
        new ValidateDTOMiddleware(LoginUserDto),
      ]
    });
    this.addRoute({
      path: '/sign-out',
      method: HttpMethod.Post,
      handler: this.logout,
      middlewares: [new CheckUserAuthMiddleware()],
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
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

    const rawToken = await this.tokenService.getRawToken(token);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await this.issuedTokenService.issue(user.id, rawToken.exp, rawToken.jti);

    this.ok(res, {
      ...fillDTO(SignInUserRdo, user),
      token
    });
  }

  public async logout(req: ExtendedRequestInterface, res: Response): Promise<void> {
    const token = String(req.headers.authorization?.split(' ')[1]);
    const rawToken = await this.tokenService.getRawToken(token);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await this.issuedTokenService.revoke(rawToken.jti);

    this.noContent(res, {token});
  }

  public async uploadAvatar(req: Request, res: Response) {
    const {userId} = req.params;
    const uploadFile = {avatar: req.file?.filename};
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await this.userService.updateById(userId, uploadFile);
    this.created(res, fillDTO(AvatarRdo, uploadFile));
  }

}
