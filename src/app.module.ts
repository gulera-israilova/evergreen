import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FlowersModule } from './flowers/flowers.module';
import { BranchesModule } from './branches/branches.module';
import { CategoriesModule } from './categories/categories.module';
import { BouquetsModule } from './bouquets/bouquets.module';
import { FlowersBouquetsModule } from './flowers-bouquets/flowers-bouquets.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, FlowersModule, BranchesModule, CategoriesModule, BouquetsModule, FlowersBouquetsModule,OrdersModule],
})
export class AppModule {}
