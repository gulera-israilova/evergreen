import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty } from "class-validator";

export class ClientRegisterDto{
  @ApiProperty()
  phone:string

  @ApiProperty()
  firstname:string

  @IsEmpty()
  role:string
}