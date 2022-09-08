import { forwardRef, Module } from "@nestjs/common";
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { AuthModule } from "../auth/auth.module";
import { BouquetsModule } from "../bouquets/bouquets.module";
import { BranchesModule } from "../branches/branches.module";



@Module({

  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(()=>AuthModule),
    forwardRef(()=>BouquetsModule),
    forwardRef(() => BranchesModule)
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService]
})
export class UsersModule {}
