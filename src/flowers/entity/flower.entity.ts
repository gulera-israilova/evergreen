import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity({
  name: 'flower'
})
export class FlowerEntity {

  @ApiProperty({ example: '1', description: 'Flower ID' })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @ApiProperty({ example: 'Peony', description: 'Flower name' })
  @Column({ type: 'varchar', nullable: false })
  name: string

  @ApiProperty({example:'url',description:'Image url'})
  @Column({type: 'varchar', nullable: true})
  image: string

  @ApiProperty({ example: '100 som', description: 'Flower price' })
  @Column({ type: 'int', nullable: false })
  price: number

  @ApiProperty({ example: '100 pieces', description: 'Number of flowers in stock' })
  @Column({ type: 'int', nullable: false })
  quantity:number

}