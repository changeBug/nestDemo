import * as _ from 'lodash';

const defaultConfig = {
  orm: {
    type: 'mysql',
    host: '',
    port: 0,
    username: '',
    password: '',
    database: '',
    entities: ['dist/**/*.entity{.ts,.js}'],
    charset: 'utf8mb4',
    synchronize: true,
  },
  // orm: {
  //   type: 'mysql',
  //   host: 'localhost',
  //   port: 3306,
  //   username: 'root',
  //   password:  '00000000',
  //   database: 'platformlocal',
  //   entities: ['dist/**/*.entity{.ts,.js}'],
  //   charset: 'utf8mb4',
  //   synchronize: true,
  // },
};

const envConfig = _.defaultsDeep(defaultConfig);
export default envConfig;