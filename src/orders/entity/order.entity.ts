import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "../../users/entity/user.entity";
import { OrderStatus } from "../enum/orderStatus.enum";
import { BouquetEntity } from "../../bouquets/entity/bouquet.entity";
import { FlowerBouquetEntity } from "../../flowers-bouquets/entity/flower-bouquet.entity";


@Entity({
  name: 'order'
})

export class OrderEntity{
  @ApiProperty({example:'1',description:'Bouquet ID'})
  @PrimaryGeneratedColumn({type: 'int'})
  id: number

  @ApiProperty({example:'Elon',description:'User firstname'})
  @Column({type: 'varchar', nullable: false})
  firstname: string

  @Column({type: 'varchar', nullable: false})
  @ApiProperty({example:'+996777223456',description:'Client phone number'})
  client: UserEntity

  @ApiProperty({example:'Avenue Street,5',description:'Delivery address'})
  @Column({type: 'varchar', nullable: false})
  address: string

  @ApiProperty({example:'Additional wishes',description:'Raise the flower to the 12th floor'})
  @Column({type: 'varchar', nullable: true})
  comments: string

  @CreateDateColumn()
  created_at: Date

  @ApiProperty({example:'2800',description:'Total order amount'})
  @Column({type: 'int', nullable: false})
  total_cost: number

  @ApiProperty({example:'2800',description:'Total order amount'})
  @Column({type: 'int', nullable: true})
  earnedByCourier:number

  @ApiProperty({example:'waiting', description:''})
  @Column({type: 'enum', enum: OrderStatus, default: OrderStatus.waiting})
  status: OrderStatus

  @ManyToOne(() => UserEntity, (courier) => courier.phone, {cascade: ["insert", "update"], nullable: true })
  @JoinColumn()
  @ApiProperty()
  courier: UserEntity

  bouquets:BouquetEntity[]
}