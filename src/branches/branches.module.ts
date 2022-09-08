import { forwardRef, Module } from "@nestjs/common";
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import { TypeOrmModule } from "@nestjs/typeorm";

import { BranchEntity } from "./entity/branch.entity";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports:[TypeOrmModule.forFeature([BranchEntity]),
    forwardRef(()=>AuthModule),
    forwardRef(()=>UsersModule)
    ],
  controllers: [BranchesController],
  providers: [BranchesService],
  exports:[BranchesService]
})
export class BranchesModule {}
