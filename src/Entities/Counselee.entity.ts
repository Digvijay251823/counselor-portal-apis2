import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Counselor } from './Counselor.entity';

@Entity()
export class Counselee {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column({ nullable: true })
  initiatedName: string;
  @Column()
  phoneNumber: string;
  @Column()
  gender: string;
  @Column()
  age: number;
  @Column({ nullable: true })
  email: string;
  @Column({ default: 'UNMARRIED' })
  maritalStatus: string;
  @Column()
  address: string;
  @Column({ nullable: true })
  profession: string;
  @Column({ nullable: true })
  yourInitiatingSpiritualMaster: string;
  @Column({ nullable: true })
  harinamInitiationDate: string;
  @Column({ nullable: true })
  legalNameOfSpouce: string;
  @Column({ nullable: true })
  harinamInitiationPlace: string;
  @Column({ nullable: true })
  chantingRounds: number;
  @Column({ nullable: true })
  chantingStartedThisRoundsDate: Date;
  @Column({ nullable: true })
  recommendedBy: string;
  @Column({ nullable: true })
  comments: string;
  @ManyToOne(() => Counselor, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  currentCounselor: Counselor;
  @Column({ nullable: true })
  connectedToCounselorSince: Date;
  @OneToOne(() => Counselee, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  spouce: Counselee;
  @Column({ type: 'jsonb', nullable: true })
  children: JSON;
  @Column({ default: 0 })
  sessionsAttended: number;
  @Column({ default: 0 })
  totalSessions: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
