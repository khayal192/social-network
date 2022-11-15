import { Module } from '@nestjs/common';
import { BannedService } from './banned.service';
import { BannedController } from './banned.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannedListEntity } from '../entities/banned.entity';
import { UserEntity } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BannedListEntity, UserEntity])],
  controllers: [BannedController],
  providers: [BannedService],
})
export class BannedModule {}
