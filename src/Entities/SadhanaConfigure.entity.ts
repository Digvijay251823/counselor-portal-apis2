import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Counselor } from './Counselor.entity';

@Entity()
export class SadhanaConfigure {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Counselor)
  counselor: Counselor;
  @Column({ nullable: true })
  numberOfRounds: boolean;
  @Column({ nullable: true })
  first8RoundsCompletedTime: boolean;
  @Column({ nullable: true })
  next8RoundsCompletedTime: boolean;
  @Column({ nullable: true })
  wakeUpTime: boolean;
  @Column({ nullable: true })
  sleepTime: boolean;
  @Column({ nullable: true })
  prabhupadaBookReading: boolean;
  @Column({ nullable: true })
  nonPrabhupadaBookReading: boolean;
  @Column({ nullable: true })
  prabhupadaClassHearing: boolean;
  @Column({ nullable: true })
  guruClassHearing: boolean;
  @Column({ nullable: true })
  otherClassHearing: boolean;
  @Column({ nullable: true })
  speaker: boolean;
  @Column({ nullable: true })
  attendedArti: boolean;
  @Column({ nullable: true })
  mobileInternetUsage: boolean;
  @Column({ nullable: true })
  topic: boolean;
  @Column({ nullable: true })
  visibleSadhana: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
