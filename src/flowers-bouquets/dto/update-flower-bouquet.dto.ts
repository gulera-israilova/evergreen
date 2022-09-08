import {ApiProperty} from '@nestjs/swagger';
import { IsEmpty, IsNumber } from "class-validator";
import { FlowerEntity } from "../../flowers/entity/flower.entity";
import { BouquetEntity } from "../../bouquets/entity/bouquet.entity";

export class UpdateFlowerBouquetDto {
  @ApiProperty()
  @IsNumber()
  flower:number

  @ApiProperty()
  @IsNumber()
  quantity: number

}

export class UpdateFBDto {

  @IsNumber()
  flower:FlowerEntity

  @IsNumber()
  quantity: number

  @IsNumber()
  bouquet: BouquetEntity

}