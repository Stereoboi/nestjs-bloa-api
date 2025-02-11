import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { UserService } from 'src/users/providers/users.service';
import { GenerateTokensProvider } from 'src/auth/providers/generate-tokens.provider';

@Injectable()
export class GoogleAuthenticationsService implements OnModuleInit {
  private oauthClient: OAuth2Client;
  constructor(
    /** Inject jwt configurations */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    /** Inject users service */
    @Inject(forwardRef(() => UserService))
    private readonly usersService: UserService,
    /** generate tone provider */
    private readonly generatetokensProvider: GenerateTokensProvider,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      // verify token sent by user
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });
      console.log(loginTicket);
      // extract payload from google payload
      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = loginTicket.getPayload();
      // Find the user in the DB using the google id
      const user = await this.usersService.findOneByGoogleId(googleId);
      // If google id exists generate token
      if (user) {
        return this.generatetokensProvider.generateTokens(user);
      }
      // If not create a new user and then generate token
      const newuser = await this.usersService.createGoogleUser({
        email: email,
        firstName: firstName,
        lastName: lastName,
        googleId: googleId,
      });
      return this.generatetokensProvider.generateTokens(newuser);
    } catch (error) {
      // throw unathorize
      throw new UnauthorizedException(error);
    }
  }
}
