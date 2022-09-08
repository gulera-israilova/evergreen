import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsString } from "class-validator";
import { OrderStatus } from "../enum/orderStatus.enum";


export class UpdateOrderAdminDto {

  @ApiProperty({description:'Client firstname: Elon', required: true})
  @IsString({message:'Must be a string value'})
  firstname: string

  @ApiProperty({description:'Phone number: +996777123456', required:true})
  @IsString({message:'Must be a string value'})
  client: string

  @ApiProperty({description:'Delivery address: Avenue Street,5', required:true})
  @IsString({message:'Must be a string value'})
  address: string

  @ApiProperty({type: 'array',  items: { type: 'number'}})
  @IsNumber()
  bouquets: number[]

  @ApiProperty({description:'Additional wishes: Raise the flower to the 12th floor', required:false})
  @IsString({message:'Must be a string value'})
  comments: string

  @ApiProperty({description:'Total order amount: 2800',required:true})
  @IsNumber()
  total_cost: number

  @ApiProperty({description:'Order status, example: approved'})
  @IsEnum(OrderStatus)
  status: string

}