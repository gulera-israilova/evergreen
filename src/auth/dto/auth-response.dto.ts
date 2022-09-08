import { RoleEnum } from "../../users/enum/role.enum";

export class AuthResponseDto {
  token:string
  role:RoleEnum
  firstname:string
}