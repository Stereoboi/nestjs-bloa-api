import { Post } from 'src/posts/post.entity';
import { json } from 'stream/consumers';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Metaoptions {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'json',
    nullable: false,
  })
  metaValue: string;
  @CreateDateColumn()
  createDate: Date;
  @UpdateDateColumn()
  updateDate: Date;
  @OneToOne(() => Post, (post) => post.metaOptions, { onDelete: 'CASCADE' })
  @JoinColumn()
  post: Post;
}
