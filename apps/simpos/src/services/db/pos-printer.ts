import { db } from './db';

export interface PosPrinter {
  id: number;
  name: string;
  product_categories_ids: number[];
  printer_type: 'network_printer' | 'iot';
  network_printer_ip?: string;
}

export const posPrinterRepository = {
  db: db.table<PosPrinter>('pos.printer'),

  async all(): Promise<PosPrinter[]> {
    return this.db.toArray();
  },
};
