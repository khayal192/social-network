import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from './post.entity';
import { CommentEntity } from './comment.entity';
import { LikeEntity } from './like.entity';
import { BannedListEntity } from './banned.entity';
import { ShareEntity } from './share.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  public currentHashedRefreshToken?: string;

  @Column({ default: false })
  public isEmailConfirmed: boolean;

  @OneToMany(() => PostEntity, (post) => post.user, {
    onDelete: 'CASCADE',
  })
  posts: PostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  comments: CommentEntity[];

  @OneToMany(() => LikeEntity, (like) => like.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  like: LikeEntity[];

  @OneToMany(() => BannedListEntity, (banned) => banned.user, {
    onDelete: 'CASCADE',
  })
  banned: BannedListEntity[];

  @OneToMany(() => BannedListEntity, (banned) => banned.user, {
    onDelete: 'CASCADE',
  })
  banning: BannedListEntity[];

  @OneToMany(() => ShareEntity, (share) => share.user, {
    onDelete: 'CASCADE',
  })
  send: UserEntity[];

  @OneToMany(() => ShareEntity, (share) => share.user, {
    onDelete: 'CASCADE',
  })
  sender: UserEntity[];
}
