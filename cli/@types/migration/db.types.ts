type DatabaseAdapterType = {
  connect(): Promise<void>
  disconnect(): Promise<void>
  // run(sql: string, params?: unknown[]): Promise<unknown[]>;

  // transaction?(fn: (trx: DatabaseAdapter) => Promise<any>): Promise<any>;
  query(sql: string): Promise<unknown[]>
  exec(sql: string): Promise<unknown>

  //   migrate?(sql: string): Promise<void>;
}

export type { DatabaseAdapterType }
