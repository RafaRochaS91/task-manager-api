import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { InternalServerErrorException, ConflictException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto;

    try {
      await this.insert({ username, password });
    } catch ({ code, message }) {
      if (code === '23505') { // code for duplicate key
        throw new ConflictException(`There's already a user with username: ${username}`);
      }

      throw new InternalServerErrorException(message);
    }
  }
}
