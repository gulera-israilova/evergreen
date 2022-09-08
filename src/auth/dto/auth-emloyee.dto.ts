import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class AuthEmployeeDto {

  @ApiProperty({description: 'Phone number: +996777123456', required: true})
  @IsString({message:'Must be a string value'})
  phone: string;

  @ApiProperty({description:'User password', required:true})
  @IsString({message:'Must be a string value'})
  password: string;
}