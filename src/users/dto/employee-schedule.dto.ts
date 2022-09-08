import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Type } from "class-transformer";

export class EmployeeScheduleDto {
  @ApiProperty({description:'Day of the week', required:false})
  @IsString({message:'Must be a string value'})
  @Type(() => String)
  day: string

  @ApiProperty({description:'Start time', required:false})
  @IsString({message:'Must be a string value'})
  @Type(() => String)
  startedAt: string

  @ApiProperty({description:'End time', required:false})
  @IsString({message:'Must be a string value'})
  @Type(() => String)
  endedAt: string
}