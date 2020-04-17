import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const allIncome = await this.find({ where: { type: 'income' } });
    const income = allIncome.reduce((total, transaction) => {
      return total + transaction.value;
    }, 0);
    const allOutcome = await this.find({ where: { type: 'outcome' } });
    const outcome = allOutcome.reduce((total, transaction) => {
      return total + transaction.value;
    }, 0);
    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
