import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmpty, IsEnum, IsNumber, IsString, ValidateNested } from "class-validator";
import { BouquetStatus } from "../enum/bouquet.status";
import { Type } from "class-transformer";
import { UpdateFBDto, UpdateFlowerBouquetDto } from "../../flowers-bouquets/dto/update-flower-bouquet.dto";
import { BranchEntity } from "../../branches/entity/branch.entity";
import { CategoryEntity } from "../../categories/entity/category.entity";


export class UpdateBouquetDto {

  @ApiProperty({description:'The name of the bouquet', required:true})
  @IsString({message:'Must be a string value'})
  name: string

  @ApiProperty({description:'Description of the bouquet', required: false})
  @IsString({message:'Must be a string value'})
  description: string

  @ApiProperty({type: 'array',   items: { type: 'string', format: 'binary'}, required:true, description:'Image url'})
  @IsString({message:'Must be a string value'})
  images: string[]

  @IsEmpty()
  price: number

  @ApiProperty({type: [UpdateFlowerBouquetDto],required:true})
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFlowerBouquetDto)
  composition: UpdateFlowerBouquetDto[]

  @ApiProperty({description:'Category ID',required:true})
  @IsNumber()
  category: number

  @IsEmpty()
  status: BouquetStatus
}

export class UpdateBDto {

  name: string


  description: string


  images: string[]

  @IsEmpty()
  price: number


  composition: UpdateFBDto[]

  @IsEmpty()
  branch: number

  @IsEmpty()
  florist_phone: string

  @IsEmpty()
  florist_name: string

  category: number

  @IsEmpty()
  status: BouquetStatus
}

