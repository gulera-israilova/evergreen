import { IsArray, IsDate, IsEmail, IsEmpty, IsEnum, IsNumber, IsString, ValidateNested } from "class-validator";
import { RoleEnum } from "../enum/role.enum";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { EmployeeScheduleDto } from "./employee-schedule.dto";

export class CreateEmployeeDto {

  @ApiProperty({description:'Phone number: +996777123456', required:true})
  @IsString({message:'Must be a string value'})
  phone: string

  @IsEmpty()
  password: string

  @ApiProperty({description:'User firstname: Elon', required: true})
  @IsString({message:'Must be a string value'})
  firstname: string

  @ApiProperty({description:'User lastname: Musk', required: true})
  @IsString({message:'Must be a string value'})
  lastname: string

  @ApiProperty({description:'Image url', required: false,  format: 'binary',   type: 'string'})
  @IsString({message:'Must be a string value'})
  image: string

  @ApiProperty({description:'Employee email: flower@gmail.com', required: true})
  @IsEmail({message:'Must be a string value'})
  email: string

  @ApiProperty({description:'Users birthday: 2000-01-27', required: true})
  @IsDate({message:'Enter the date in the format yyyy-mm-dd'})
  @Type(() => Date)
  birthday: Date
  //
  // @ApiProperty({type: [EmployeeScheduleDto],required:true})
  // @ValidateNested({ each: true })
  // @Type(() => EmployeeScheduleDto)
  // schedule: EmployeeScheduleDto[]
  //
  @ApiProperty({description:'10:00-18:00#10:00-18:00#10:00-18:00#10:00-18:00#10:00-18:00#00:00-00:00#00:00-00:00', required: true})
  @IsString({message:'Must be a string value'})
  schedule: string

  @ApiProperty({description:'Beginning of work: 2022-01-25', required: true})
  @IsDate({message:'Enter the date in the format yyyy-mm-dd'})
  @Type(() => Date)
  beginning_of_work: Date

  @ApiProperty({description:'Branch ID',required:true})
  @IsNumber()
  branch: number

  @ApiProperty({description:'Employee\'s position', required: true })
  @IsEnum(RoleEnum)
  role: RoleEnum
}
