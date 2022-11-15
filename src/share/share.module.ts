import { Module } from '@nestjs/common';
import { ShareService } from './share.service';
import { ShareController } from './share.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShareEntity } from '../entities/share.entity';
import { UserEntity } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShareEntity, UserEntity])],
  controllers: [ShareController],
  providers: [ShareService],
})
export class ShareModule {}
