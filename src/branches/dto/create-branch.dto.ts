import { ApiProperty } from "@nestjs/swagger";
import { IsString, ValidateIf } from "class-validator";

export class CreateBranchDto{

  @ApiProperty({description:'Branch name', required: true})
  @IsString({message:'Must be a string value'})
  name: string

  @ApiProperty({description:'Branch address', required: true})
  @IsString({message:'Must be a string value'})
  address: string

  @ApiProperty({description:'Branch opening hours', required: true})
  @IsString({message:'Must be a string value'})
  opening_hours: string

  @ApiProperty({description:'Branch phone number', required: true})
  @IsString({message:'Must be a string value'})
  phone: string

  @ApiProperty({description:'Image url', required: false,  format: 'binary',   type: 'string'})
  @IsString({message:'Must be a string value'})
  image: string

  @ApiProperty({description:'Link to address in 2gis', required: true})
  @IsString({message:'Must be a string value'})
  addressLink: string
}