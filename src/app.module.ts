import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { MailModule } from './mail/mail.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { PostEntity } from './entities/post.entity';
import { CommentEntity } from './entities/comment.entity';
import { LikeModule } from './like/like.module';
import { LikeEntity } from './entities/like.entity';
import { BannedModule } from './banned/banned.module';
import { BannedListEntity } from './entities/banned.entity';
import { ShareModule } from './share/share.module';
import { ShareEntity } from './entities/share.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [
        UserEntity,
        PostEntity,
        CommentEntity,
        LikeEntity,
        BannedListEntity,
        ShareEntity,
      ],
      synchronize: true,
    }),

    UserModule,
    AuthModule,
    MailModule,
    PostModule,
    CommentModule,
    LikeModule,
    BannedModule,
    ShareModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
