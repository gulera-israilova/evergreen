import { ApiProperty } from "@nestjs/swagger";

export class AuthClientDto {
  @ApiProperty()
  phone: string
}