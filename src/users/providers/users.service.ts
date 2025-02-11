import {
  Injectable,
  Inject,
  forwardRef,
  RequestTimeoutException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindUserByEmailProvider } from './find-user-by-email.provider';
import { FindOneByGoogleIdProvider } from 'src/users/providers/find-one-by-google-id.provider';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { GoogleUser } from '../interfaces/google-user.interface';
/**
 * Class to connect to Users table and perform business operattions
 */
@Injectable()
export class UserService {
  constructor(
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,

    /**
     * The method to get all users from DB
     */
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    /**
     * Inject datasource
     */
    private readonly dataSource: DataSource,

    /**Create many provider */
    private readonly usersCreatemanyProvider: UsersCreateManyProvider,

    /**Inject createuserProvider */
    private readonly createUserProvider: CreateUserProvider,

    /**Inject find one by email provider */
    private readonly findUserByEmailProvider: FindUserByEmailProvider,

    /**Inject Find one by google id provider */
    private readonly findOneByGoogleIdProvider: FindOneByGoogleIdProvider,

    /** Inject create user google provider */
    private readonly createGoogleUserProvider: CreateGoogleUserProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  public findAll(
    getUserParamDto: GetUsersParamDto,
    limt: number,
    page: number,
  ) {
    const loggenIn = true;
    if (!loggenIn) {
      throw new HttpException(
        {
          status: HttpStatus.MOVED_PERMANENTLY,
          error: `The API endpoint doesn't exist anymore`,
          fileName: 'users.service.ts',
          lineNumber: 103,
        },
        HttpStatus.MOVED_PERMANENTLY,
        {
          cause: new Error(),
          description:
            'Occured because the API endpoint was permanently moved to a new location',
        },
      );
    }
  }

  /**
   * The method to get user from DB by ID
   */

  public async findOneById(id: number) {
    try {
      return await this.userRepository.findOneBy({
        id,
      });
    } catch (e) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to database',
        },
      );
    }
  }

  public async createMany(createManyUserDto: CreateManyUsersDto) {
    return await this.usersCreatemanyProvider.createMany(createManyUserDto);
  }

  public async findOneByEmail(email: string) {
    return await this.findUserByEmailProvider.findOneByEmail(email);
  }
  public async findOneByGoogleId(googleId: string) {
    return await this.findOneByGoogleIdProvider.findOneByGoogleId(googleId);
  }

  public async createGoogleUser(googleUser: GoogleUser) {
    return await this.createGoogleUserProvider.createGoogleUser(googleUser);
  }
}
