import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import ColumnNumericTransformer from './utils/ColumnNumericTransformer';

export type TransactionType = 'income' | 'outcome';

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  type: TransactionType;

  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  value: number;

  @Column()
  category_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;
