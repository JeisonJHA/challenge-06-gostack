import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction, { TransactionType } from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';

interface Request {
  title: string;
  value: number;
  type: string;
  category_title: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category_title,
  }: Request): Promise<Transaction> {
    if (!CreateTransactionService.isTransactionType(type)) {
      throw new AppError('Type of transaction is invalid', 400);
    }
    const transactionsRepository = getCustomRepository(TransactionRepository);
    const balance = await transactionsRepository.getBalance();
    if (type === 'outcome' && balance.total < value) {
      throw new AppError('There is not enough balance.', 400);
    }
    const categoryService = new CreateCategoryService();
    const category = await categoryService.execute(category_title);
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: category.id,
    });
    await transactionsRepository.save(transaction);
    return transaction;
  }

  static isTransactionType(type: string): type is TransactionType {
    return type === 'income' || type === 'outcome';
  }
}

export default CreateTransactionService;
