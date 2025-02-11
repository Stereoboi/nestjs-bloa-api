import { Body, Controller, Post } from '@nestjs/common';
import { GoogleAuthenticationsService } from './providers/google-authentications.service';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { Auth } from '../decorator/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';

@Auth(AuthType.None)
@Controller('auth/google-authentication')
export class GoogleAuthenticationController {
  constructor(
    /**Inject google authentication service */

    private readonly googleAuthenticationService: GoogleAuthenticationsService,
  ) {}

  @Post()
  public authenticate(@Body() googleTokenDto: GoogleTokenDto) {
    return this.googleAuthenticationService.authenticate(googleTokenDto);
  }
}
