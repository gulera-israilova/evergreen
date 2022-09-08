import { forwardRef, Module } from "@nestjs/common";
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "./entity/order.entity";
import { BouquetsModule } from "../bouquets/bouquets.module";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports:[TypeOrmModule.forFeature([OrderEntity]),
    forwardRef(() => BouquetsModule),
    forwardRef(()=>AuthModule),
    forwardRef(() => UsersModule)],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
