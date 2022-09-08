import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCategoryDto{
  @ApiProperty({description:'Name of category',required:true})
  @IsString({message:"Must be a string value"})
  name:string
}