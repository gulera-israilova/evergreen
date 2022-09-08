import { forwardRef, Module } from "@nestjs/common";
import { FlowersBouquetsController } from './flowers-bouquets.controller';
import { FlowersBouquetsService } from './flowers-bouquets.service';
import { FlowerBouquetEntity } from "./entity/flower-bouquet.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BouquetsModule } from "../bouquets/bouquets.module";

@Module({
  imports: [TypeOrmModule.forFeature([FlowerBouquetEntity]),
    forwardRef(()=>BouquetsModule)],
  controllers: [FlowersBouquetsController],
  providers: [FlowersBouquetsService],
  exports:[FlowersBouquetsService]
})
export class FlowersBouquetsModule {}
