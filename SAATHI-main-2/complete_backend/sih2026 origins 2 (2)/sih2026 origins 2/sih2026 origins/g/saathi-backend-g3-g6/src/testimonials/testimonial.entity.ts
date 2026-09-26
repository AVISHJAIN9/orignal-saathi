import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity(
  'testimonials'
)
export class Testimonial {

  @PrimaryGeneratedColumn(
    'uuid'
  )
  id!: string;

  @Column(
    {
      type: 'varchar',
      length: 120
    }
  )
  name!: string;

  @Column(
    {
      type: 'varchar',
      length: 160,
      nullable: true
    }
  )
  organization!: string | null;

  @Column(
    {
      type: 'text'
    }
  )
  quote!: string;

  @Index(
  )
  @Column(
    {
      type: 'boolean',
      default: false
    }
  )
  approved!: boolean;

  @CreateDateColumn(
    {
      name: 'created_at'
    }
  )
  createdAt!: Date;

  @UpdateDateColumn(
    {
      name: 'updated_at'
    }
  )
  updatedAt!: Date;

}
