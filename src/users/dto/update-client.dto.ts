import { ApiProperty } from "@nestjs/swagger";
import { IsDate } from "class-validator";
import { Type } from "class-transformer";

export class UpdateClientDto{
  @ApiProperty()
  firstname:string

  @ApiProperty({description:'Users birthday: 2000-01-27', required: true})
  @IsDate({message:'Enter the date in the format yyyy-mm-dd'})
  @Type(() => Date)
  birthday: Date
}