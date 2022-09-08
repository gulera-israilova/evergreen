import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity({
  name: 'category'
})
export class CategoryEntity {

  @ApiProperty({ example: '1', description: 'Category ID' })
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @ApiProperty({ example: 'For decor', description: ' Category name' })
  @Column({ type: 'varchar', nullable: false })
  name: string
}