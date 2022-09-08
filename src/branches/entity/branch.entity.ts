import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity({
  name: 'branch'
})
export class BranchEntity{

  @ApiProperty({example:'1',description:'Branch ID'})
  @PrimaryGeneratedColumn({type: 'int'})
  id:number

  @ApiProperty({example:'Branch in the center',description:'Branch name'})
  @Column({type: 'varchar', nullable: false})
  name: string

  @ApiProperty({example:'Avenue 5',description:'Branch address'})
  @Column({type: 'varchar', nullable: false})
  address: string

  @ApiProperty({example:'10:00-18:00',description:'Branch opening hours'})
  @Column({type: 'varchar', nullable: false})
  opening_hours: string

  @ApiProperty({example:'+996777454545',description:'Branch phone number'})
  @Column({type: 'varchar', nullable: false})
  phone: string

  @ApiProperty({example:'url',description:'Image url', required: false})
  @Column({type: 'varchar', nullable: true})
  image: string

  @ApiProperty({example:'link',description:'Link to address in 2gis'})
  @Column({type: 'varchar', nullable: false})
  addressLink: string
}