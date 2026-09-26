import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity(
  'password_reset_tokens'
)
export class PasswordResetToken {

  @PrimaryGeneratedColumn(
    'uuid'
  )
  id!: string;

  @Index(
  )
  @Column(
    {
      type: 'uuid',
      name: 'user_id'
    }
  )
  userId!: string;

  @Index(
    {
      unique: true
    }
  )
  @Column(
    {
      type: 'varchar',
      length: 64,
      name: 'token_hash'
    }
  )
  tokenHash!: string;

  @Column(
    {
      type: 'timestamptz',
      name: 'expires_at'
    }
  )
  expiresAt!: Date;

  @Column(
    {
      type: 'timestamptz',
      name: 'used_at',
      nullable: true
    }
  )
  usedAt!: Date | null;

  @CreateDateColumn(
    {
      name: 'created_at'
    }
  )
  createdAt!: Date;

}
