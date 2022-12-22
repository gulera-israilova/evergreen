import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from "../users/entity/user.entity";
import { BranchEntity } from "../branches/entity/branch.entity";
import { FlowerEntity } from "../flowers/entity/flower.entity";
import {config} from "dotenv"
import { BouquetEntity } from "../bouquets/entity/bouquet.entity";
import { OrdersModule } from "../orders/orders.module";
import { CategoryEntity } from "../categories/entity/category.entity";
import { FlowerBouquetEntity } from "../flowers-bouquets/entity/flower-bouquet.entity";

config()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      "host": process.env.DB_HOST,
      "port": +process.env.DB_PORT,
      "username": process.env.DB_USERNAME,
      "password": process.env.DB_PASSWORD,
      "database": process.env.DB_DATABASE,
        ssl:{
          rejectUnauthorized:false
        }
      },
      entities:[UserEntity,BranchEntity,FlowerEntity,BouquetEntity,CategoryEntity,FlowerBouquetEntity],
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
