## 开发调试

使用NestJS框架开发，需要有node和yarn环境

### 本地调试

首次运行先安装依赖

```sh
yarn
```

```sh
yarn start
```

## module设计

常规业务平铺在AppModule中，按照controller-service-entity分离

耦合性较低的业务新增Module，目前有：

- UserModule 用户管理相关

## 数据库

使用TypeORM管理，一般情况下不直接修改数据库的表结构，而是通过更改 *.entity.ts 文件，本地运行时会自动同步表结构变更。

