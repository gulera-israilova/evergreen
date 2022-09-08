import { forwardRef, Module } from "@nestjs/common";
import { FlowersController } from './flowers.controller';
import { FlowersService } from './flowers.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { FlowerEntity } from "./entity/flower.entity";
import { BouquetsModule } from "../bouquets/bouquets.module";
import { AuthModule } from "../auth/auth.module";


@Module({
  imports:[TypeOrmModule.forFeature([FlowerEntity],),
  forwardRef(()=>BouquetsModule),
  forwardRef(()=>AuthModule)],
  controllers: [FlowersController],
  providers: [FlowersService],
  exports:[FlowersService]
})
export class FlowersModule {}
