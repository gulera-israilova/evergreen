import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BouquetStatus } from "../enum/bouquet.status";
import { BranchEntity } from "../../branches/entity/branch.entity";
import { CategoryEntity } from "../../categories/entity/category.entity";
import { FlowerBouquetEntity } from "../../flowers-bouquets/entity/flower-bouquet.entity";
import { OrderEntity } from "../../orders/entity/order.entity";
import { UserEntity } from "../../users/entity/user.entity";

@Entity({
  name: 'bouquet'
})
export class BouquetEntity{
  @ApiProperty({example:'1',description:'Bouquet ID'})
  @PrimaryGeneratedColumn({type: 'int'})
  id: number

  @ApiProperty({example:'Golden autumn',description:'The name of the bouquet'})
  @Column({type: 'varchar', nullable: false,unique:true})
  name: string

  @ApiProperty({example:'The bouquet consists ... etc',description:'Description of the bouquet'})
  @Column({type: 'varchar', nullable: true})
  description: string

  @ApiProperty({example:'[urls]',description:'Images url'})
  @Column({type: 'varchar', nullable: true})
  images: string[]

  @ApiProperty({example:'500 som',description:'Bouquet price'})
  @Column({type: 'int', nullable: false})
  price: number

  @ManyToOne(() => UserEntity, (user) => user.phone, {cascade: ["insert", "update"],nullable: false })
  @JoinColumn()
  florist_phone: UserEntity

  @ApiProperty({example:'Dana',description:'Name of the florist who created the bouquet'})
  @Column({type: 'varchar', nullable: false})
  florist_name: string

  @OneToMany(() => FlowerBouquetEntity, nd => nd.bouquet)
  @ApiProperty({type: FlowerBouquetEntity})
  composition: FlowerBouquetEntity[]

  @ManyToOne(() => BranchEntity, (branch) => branch.id, {cascade: ["insert", "update"],eager:true,nullable: false })
  @JoinColumn()
  @ApiProperty({type: BranchEntity})
  branch: BranchEntity

  @ManyToOne(() => CategoryEntity, (category) => category.id, {cascade: ["insert", "update"],eager:true,nullable: false })
  @ApiProperty({type: CategoryEntity})
  @JoinColumn()
  category: CategoryEntity

  @ManyToOne(() => OrderEntity, (order) => order.id, {cascade: ["insert", "update"],nullable: true })
  @ApiProperty({type: OrderEntity})
  @JoinColumn()
  order: OrderEntity

  @CreateDateColumn({type:'timestamp',nullable:false})
  created_at: Date

  @Column({
    type: "enum",
    enum: BouquetStatus,
    default: BouquetStatus.AVAILABLE
  })
  status: BouquetStatus
}


