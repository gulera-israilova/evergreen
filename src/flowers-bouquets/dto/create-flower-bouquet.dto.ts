import { ApiProperty } from "@nestjs/swagger";
import { FlowerEntity } from "../../flowers/entity/flower.entity";

export class CreateFlowerBouquetDto{
  @ApiProperty()
  flower:number

  @ApiProperty()
  quantity:number

}
export class CreateFbDto{

  flower: FlowerEntity

  bouquet: number

  quantity: number
}
