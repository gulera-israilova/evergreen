import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
 export class ImageUploadDto{
   @ApiProperty({description:'Image url', required: true,  format: 'binary',   type: 'string'})
   @IsString({message:'Must be a string value'})
   image: string
 }
