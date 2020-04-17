import fs from 'fs';
import path from 'path';
import parse from 'csv-parse/lib/sync';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';
import uploadConfig from '../config/upload';

interface CSV {
  title: string;
  type: string;
  value: number;
  category: string;
}
class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const filePath = path.join(uploadConfig.directory, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    const transactionsCSV = parse(content, {
      columns: true,
      delimiter: ',',
      trim: true,
    }) as CSV[];
    const transactions: Transaction[] = [];
    const createTransactionService = new CreateTransactionService();
    // eslint-disable-next-line no-restricted-syntax
    for (const { title, type, value, category } of transactionsCSV) {
      // eslint-disable-next-line no-await-in-loop
      const transaction = await createTransactionService.execute({
        title,
        type,
        value: +value,
        category_title: category,
      });
      transactions.push(transaction);
    }
    await fs.promises.unlink(filePath);
    return transactions;
  }
}

export default ImportTransactionsService;
