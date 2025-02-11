import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UserService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider.ts';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class SignInProvider {
  constructor(
    /**Inject UserService */
    @Inject(forwardRef(() => UserService))
    private readonly usersService: UserService,

    /**Inject hashing provider */
    private readonly hashingProvider: HashingProvider,

    /** inject generate token provider */
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    // find user by email ID
    const user = await this.usersService.findOneByEmail(signInDto.email);
    // Throw exception if user is not found
    // Above | Taken care by the findInByEmail method

    let isEqual: boolean = false;

    try {
      // Compare the password to hash
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare the password',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Password does not match');
    }
    return await this.generateTokensProvider.generateTokens(user);
  }
}
