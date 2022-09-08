import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { RoleEnum } from "../enum/role.enum";
import { EmployeeScheduleDto } from "../dto/employee-schedule.dto";
import { BranchEntity } from "../../branches/entity/branch.entity";

@Entity({
  name: 'user'
})
export class UserEntity{
  @ApiProperty({example:'+996777123456',description:'Phone number'})
  @PrimaryColumn({type: 'varchar', nullable: false, unique: true})
  phone: string

  @ApiProperty({example:'Elon',description:'User firstname'})
  @Column({type: 'varchar', nullable: false})
  firstname: string

  @ApiProperty({example:'Musk',description:'User lastname'})
  @Column({type: 'varchar', nullable: true})
  lastname: string

  @ApiProperty({example:'flower@gmail.com',description:'Employee email'})
  @Column({type: 'varchar', nullable: true})
  email: string

  @ApiProperty({example:'url',description:'Image url'})
  @Column({type: 'varchar', nullable: true})
  image: string

  @ApiProperty({example:'2000-01-25',description:'Users birthday'})
  @Column({type: 'date', nullable: true})
  birthday: string

  @ApiProperty({example:'admin/florist/courier/client',description:'User role'})
  @Column({type: 'enum', enum: RoleEnum, default: RoleEnum.CLIENT})
  role: RoleEnum

  @ApiProperty({example:'1234',description:'User password'})
  @Column({type: 'varchar', nullable: true})
  password: string

  // @ApiProperty({type: [EmployeeScheduleDto]})
  // @Column({type:'json', nullable: true})
  // schedule: object[]

  @ApiProperty({example:""})
  @Column({type:'varchar', nullable: true})
  schedule: string

  @ApiProperty({example:'2022-01-25',description:'Beginning of work', required: false})
  @Column({type: 'date', nullable: true})
  beginning_of_work: string

  @ManyToOne(() => BranchEntity, (branch) => branch.id, {cascade: ["insert", "update"],eager:true,nullable: false })
  @JoinColumn()
  @ApiProperty({type: BranchEntity})
  branch: BranchEntity
}

