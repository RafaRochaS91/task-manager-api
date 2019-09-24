import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig:  TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'rafa1234',
  database: 'task_manager',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
}
