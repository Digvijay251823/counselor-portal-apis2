import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ScheduledSession } from './ScheduledSession.entity';
import { Counselor } from './Counselor.entity';
import { Counselee } from './Counselee.entity';
import { CBMMeeting } from './CBMMeetings.entity';

// created
@Entity()
export class CBMAttendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => CBMMeeting)
  @JoinColumn()
  cbmMeeting: CBMMeeting;
  @ManyToOne(() => Counselor)
  @JoinColumn()
  counselor: Counselor;
  @Column({ default: 'Attendance' })
  type: 'Attendance' | 'RSVP';
  @Column({ nullable: true })
  isRSVP: boolean;
  @Column()
  modeOfAttendance: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
