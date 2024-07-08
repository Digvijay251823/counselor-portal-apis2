import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Counselee } from './Counselee.entity';
import { Counselor } from './Counselor.entity';
import { Activities } from './Activities.entity';

@Entity()
export class counseleeActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Counselee)
  @JoinColumn()
  counselee: Counselee;
  @Column()
  description: string;
  @ManyToOne(() => Counselor)
  @JoinColumn()
  counselor: Counselor;
  @ManyToOne(() => Activities)
  @JoinColumn()
  activity: Activities;
  @Column()
  activityDate: Date;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
