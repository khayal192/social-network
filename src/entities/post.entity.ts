import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { CommentEntity } from './comment.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => UserEntity, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.post, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  comments: CommentEntity;
}
