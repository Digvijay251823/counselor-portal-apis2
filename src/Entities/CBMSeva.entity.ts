import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Counselor } from './Counselor.entity';
import { CBMMeeting } from './CBMMeetings.entity';

@Entity()
export class CBMSeva {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Counselor)
  @JoinColumn()
  counselor: Counselor;
  @Column({ default: false })
  deityWorshipSeva: boolean;
  @Column({ default: false })
  guruPuja: boolean;
  @Column()
  location: string;
  @Column({ default: false })
  mangalAarti: boolean;
  @Column({ default: false })
  morningJapa: boolean;
  @Column({ default: false })
  otherSeva: boolean;
  @Column({ default: false })
  sbClass: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
