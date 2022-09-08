import { forwardRef, Module } from "@nestjs/common";
import { BouquetsController } from './bouquets.controller';
import { BouquetsService } from './bouquets.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { BouquetEntity } from "./entity/bouquet.entity";
import { FlowersBouquetsModule } from "../flowers-bouquets/flowers-bouquets.module";
import { FlowersModule } from "../flowers/flowers.module";
import { OrdersModule } from "../orders/orders.module";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";


@Module({
  imports:[TypeOrmModule.forFeature([BouquetEntity]),
    forwardRef(() => FlowersBouquetsModule),
    forwardRef(() => FlowersModule),
    forwardRef(()=>OrdersModule),
    forwardRef(()=>AuthModule),
    forwardRef(() => UsersModule)],
  controllers: [BouquetsController],
  providers: [BouquetsService],
  exports:[BouquetsService]
})
export class BouquetsModule {}
