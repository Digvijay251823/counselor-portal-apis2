import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn, // Import the necessary decorators
} from 'typeorm';

const JWT_SECRET = '5f8f12c9-dcbf-4e88-b58b-8d706f3a4e31';

@Entity()
export class Counselor {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  firstName: string;
  @Column({ nullable: true })
  lastName: string;
  @Column({ nullable: true })
  initiatedName: string;
  @Column()
  phoneNumber: string;
  @Column()
  gender: string;
  @Column({ nullable: true })
  age: number;
  @Column({ nullable: true })
  email: string;
  @Column({ select: false, nullable: true })
  password: string;
  @Column({ default: 'UNMARRIED' })
  maritalStatus: string;
  @OneToOne(() => Counselor, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  husband: Counselor;
  @OneToOne(() => Counselor, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  spouce: Counselor;
  @Column({ nullable: true })
  address: string;
  @Column({ nullable: true })
  profession: string;
  @Column({ nullable: true })
  chantingRounds: number;
  @Column({ nullable: true })
  chantingStartedThisRoundsDate: Date;
  @Column({ nullable: true })
  yourInitiatingSpiritualMaster: string;
  @Column({ nullable: true })
  harinamInitiationDate: Date;
  @Column({ default: 'assistantcounselor' })
  role: 'cct' | 'counselor' | 'assistantcounselor';
  @Column({ nullable: true })
  harinamInitiationPlace: string;
  @Column({ type: 'jsonb', nullable: true })
  children: JSON;
  @Column({ default: true })
  autoApprove: boolean;
  @Column({ default: 2 })
  sessionExpirationTime: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  getJWTToken() {
    const token = jwt.sign(
      { id: this.id, role: this.role, phoneNumber: this.phoneNumber },
      JWT_SECRET,
      {
        expiresIn: '15d',
      },
    );
    return token;
  }

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.isHashed(this.password)) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  private isHashed(password: string): boolean {
    // Assuming that hashed passwords are 60 characters long for bcrypt
    return password && password.length === 60;
  }
}
