import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from './post.entity';
import { CommentEntity } from './comment.entity';

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
}
