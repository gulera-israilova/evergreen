import {
  Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Repository,
} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import { FlowerEntity } from "../../flowers/entity/flower.entity";
import { BouquetEntity } from "../../bouquets/entity/bouquet.entity";

@Entity({
  name: 'flower-bouquet',
})
export class FlowerBouquetEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty()
  @Column({
    type: 'int',
    nullable: false
  })
  quantity: number

  @ManyToOne(() => FlowerEntity,{eager:true})
  @ApiProperty()
  @JoinColumn()
  flower: FlowerEntity

  @ManyToOne(() => BouquetEntity)
  @JoinColumn()
  bouquet: BouquetEntity
}