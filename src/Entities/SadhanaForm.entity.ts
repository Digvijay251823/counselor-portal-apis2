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
  @ManyToOne(() => Counselor, { onDelete: 'CASCADE' })
  counselor: Counselor;
  @ManyToOne(() => Counselee, { onDelete: 'CASCADE' })
  counselee: Counselee;
  @Column({ nullable: true })
  numberOfRounds: number;
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
  nonPrabhupadaBookReading: string; //type is text
  @Column({ nullable: true })
  prabhupadaClassHearing: number; //type is time
  @Column({ nullable: true })
  guruClassHearing: number; //type is time
  @Column({ nullable: true })
  otherClassHearing: number; //type is time
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
