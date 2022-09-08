import { IsArray, IsEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { BouquetStatus } from "../enum/bouquet.status";
import { Type } from "class-transformer";
import { CreateFlowerBouquetDto } from "../../flowers-bouquets/dto/create-flower-bouquet.dto";

export class CreateBouquetDto {

  @ApiProperty({description:'The name of the bouquet', required:true})
  @IsString({message:'Must be a string value'})
  name: string

  @ApiProperty({description:'Description of the bouquet', required: false})
  @IsString({message:'Must be a string value'})
  description: string

  @ApiProperty({type: 'array',  items: { type: 'string', format: 'binary'}, required:true, description:'Image url'})
  @IsString({message:'Must be a string value'})
  images: string[]

  @IsEmpty()
  price: number

  @ApiProperty({type: [CreateFlowerBouquetDto],required:true})
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFlowerBouquetDto)
  composition: CreateFlowerBouquetDto[]

  @IsEmpty()
  @IsNumber()
  branch: number

  @IsEmpty()
  @IsString()
  florist_phone: string

  @IsEmpty()
  @IsString()
  florist_name: string

  @ApiProperty({description:'Category ID',required:true})
  @IsNumber()
  category: number

  @IsEmpty()
  status: BouquetStatus
}


