import { forwardRef, Module } from "@nestjs/common";
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryEntity } from "./entity/category.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports:[TypeOrmModule.forFeature([CategoryEntity]),
    forwardRef(()=>AuthModule)],
  controllers: [CategoriesController],
  providers: [CategoriesService]
})
export class CategoriesModule {}
