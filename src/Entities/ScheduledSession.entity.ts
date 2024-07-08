import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from './Course.entity';
import { Counselor } from './Counselor.entity';

@Entity()
export class ScheduledSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column({ type: 'timestamp' })
  startTime: Date;
  @Column({ default: false })
  expired: boolean;
  @Column()
  modeOfAttendance: string;
  @ManyToOne(() => Course)
  @JoinColumn()
  course: Course;
  @ManyToOne(() => Counselor)
  @JoinColumn()
  counselor: Counselor;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  checkExpiration() {
    const now = new Date();
    const hoursDiff =
      (now.getTime() - new Date(this.startTime).getTime()) / (1000 * 60 * 60);
    if (hoursDiff > 48) {
      this.expired = true;
    }
  }
}
