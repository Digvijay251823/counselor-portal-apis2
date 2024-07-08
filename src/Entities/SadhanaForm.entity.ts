import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Counselor } from './Counselor.entity';
import { Counselee } from './Counselee.entity';

@Entity()
export class SadhanaForm {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Counselor)
  counselor: Counselor;
  @ManyToOne(() => Counselee)
  counselee: Counselee;
  @Column({ nullable: true })
  numberOfRounds: string;
  @Column({ type: 'time', nullable: true })
  first8RoundsCompletedTime: string;
  @Column({ type: 'time', nullable: true })
  next8RoundsCompletedTime: string;
  @Column({ type: 'time', nullable: true })
  wakeUpTime: string;
  @Column({ type: 'time', nullable: true })
  sleepTime: string;
  @Column({ nullable: true })
  prabhupadaBookReading: number;
  @Column({ nullable: true })
  nonPrabhupadaBookReading: number;
  @Column({ nullable: true })
  prabhupadaClassHearing: number;
  @Column({ nullable: true })
  guruClassHearing: number;
  @Column({ nullable: true })
  otherClassHearing: number;
  @Column({ nullable: true })
  speaker: string;
  @Column({ nullable: true })
  attendedArti: boolean;
  @Column({ nullable: true })
  mobileInternetUsage: number;
  @Column({ nullable: true })
  topic: string;
  @Column({ nullable: true })
  visibleSadhana: string;
  @Column({ nullable: true })
  sadhanaDate: Date;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
