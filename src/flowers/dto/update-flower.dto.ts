import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString} from "class-validator";

export class UpdateFlowerDto {

  @ApiProperty({description: 'Flower name', required: true })
  @IsString({ message: 'Must be a string value' })
  name: string

  @ApiProperty({description:'Image url', required: false,  format: 'binary',   type: 'string'})
  @IsString({message:'Must be a string value'})
  image: string

  @ApiProperty({ description: 'Flower price', required: true })
  @IsNumber()
  price: number

  @ApiProperty({description:'Number of flowers in stock', required: true})
  @IsNumber()
  quantity: number
}