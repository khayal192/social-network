import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { CommentEntity } from './comment.entity';
import { LikeEntity } from './like.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  postUrl: string;

  @ManyToOne(() => UserEntity, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.post, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  comments: CommentEntity;

  @OneToMany(() => LikeEntity, (like) => like.post, {
    onDelete: 'CASCADE',
  })
  like: LikeEntity;
}
