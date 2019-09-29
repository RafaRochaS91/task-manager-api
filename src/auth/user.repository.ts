import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { InternalServerErrorException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto;

    try {
      const salt = await bcrypt.genSalt();
      const saltedPassword = await this.hashPassword(password, salt);

      await this.insert({ username, password: saltedPassword, salt });
    } catch ({ code, message }) {
      if (code === '23505') { // code for duplicate key
        throw new ConflictException(`There's already a user with username: ${username}`);
      }
      throw new InternalServerErrorException(message);
    }
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;

    try {
      const user = await this.findOne({ username });

      console.log(user);

      if (!user) {
        return null;
      }

      const isPasswordValid = await user.validatePassword(password);

      console.log(isPasswordValid);

      if (user && isPasswordValid) {
        return user.username;
      }
      return null;
    } catch ({ message }) {
      throw new InternalServerErrorException(message);
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
