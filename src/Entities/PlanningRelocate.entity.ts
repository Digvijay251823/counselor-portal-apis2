import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PlanningRelocateEntity {
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
  @Column()
  whenwanttorelocate: string;
  @Column()
  whereplannedtolive: string;
  @Column()
  expectedsupportfromtemple: string;
  @Column({ type: 'jsonb', nullable: true })
  children: JSON;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
