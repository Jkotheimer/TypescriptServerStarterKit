import { DatabaseError } from '@models/errors';
import BaseModel from '@models/base';
import mysql from 'mysql';
import Constants from '@constants';

export class TransactionError extends Error {
    transactionInitError?: mysql.MysqlError;
    commitError?: mysql.MysqlError;
    rollbackError?: mysql.MysqlError;

    constructor(error: Error | string) {
        if (typeof error === 'string') {
            super(error);
        } else {
            super(error.message);
            Object.getOwnPropertyNames(error).forEach((prop) => {
                this[prop as keyof Error] = error[prop as keyof Error]!;
            });
        }
    }
}

export default class Database {
    public static connection: mysql.Connection;

    /**
     * Static initializer to initialize database connection
     */
    static {
        Database.connection = mysql.createConnection({
            host: process.env.MYSQL_HOST,
            database: process.env.MYSQL_DATABASE,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD
        });
    }

    /**
     * @description Wrap a function or promise in a SQL transaction
     * @param fn Function to call or promise to await
     * @returns {Promise<any, TransactionError>}
     */
    public static async wrap(fn: Function | Promise<any>): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            Database.connection.beginTransaction(async (transactionInitError: mysql.MysqlError) => {
                if (transactionInitError) {
                    const error = new TransactionError(transactionInitError);
                    error.transactionInitError = transactionInitError;
                    reject(error);
                }
                try {
                    let result;
                    if (fn instanceof Promise) {
                        result = await fn;
                    } else {
                        result = await fn();
                    }
                    Database.connection.commit((commitError) => {
                        if (commitError) {
                            const error = new TransactionError(commitError);
                            Database.connection.rollback((rollbackError) => {
                                if (rollbackError) {
                                    error.rollbackError = rollbackError;
                                }
                                reject(error);
                            });
                        } else {
                            resolve(result);
                        }
                    });
                } catch (error) {
                    Database.connection.rollback((rollbackError) => {
                        const error = new TransactionError(rollbackError);
                        error.rollbackError = rollbackError;
                        reject(error);
                    });
                }
            });
        });
    }

    /**
     * @description Execute a SQL query
     * @param query SQL query string
     * @returns Promise that resolves to an array of records resulting from query
     */
    public static async query(query: string, variables: any[] = []): Promise<Array<Record<string, any>>> {
        return new Promise<Array<Record<string, any>>>((resolve, reject) => {
            const formattedQuery = Database.connection.format(query, variables);
            console.log('Formatted Query:', formattedQuery);
            Database.connection.query(formattedQuery, (error, result) => {
                if (error) {
                    reject(new DatabaseError(error));
                } else {
                    console.log(result);
                    resolve(result);
                }
            });
        });
    }

    public static async insert(record: BaseModel): Promise<mysql.OkPacket> {
        return new Promise<mysql.OkPacket>(async (resolve, reject) => {
            const table = record.constructor.name;
            const recordClone = await record.createQuerySafeClone();
            const query = mysql.format('INSERT INTO ?? SET ?;', [table, recordClone]);
            console.log(query);
            Database.connection.query(query, (insertError: mysql.MysqlError, result: mysql.OkPacket) => {
                if (insertError) {
                    reject(new DatabaseError(insertError));
                } else {
                    resolve(result);
                }
            });
        });
    }

    public static async update(record: BaseModel): Promise<mysql.OkPacket> {
        if (!record?.Id) {
            throw new DatabaseError(Constants.ERROR_MESSAGES.CANNOT_UPDATE_RECORD_WITHOUT_ID);
        }
        const table = record.constructor.name;
        const recordClone = await record.createQuerySafeClone();
        const query = mysql.format('UPDATE ?? SET ? WHERE Id = ?', [table, recordClone, record.Id]);
        console.log(query);
        return new Promise<mysql.OkPacket>((resolve, reject) => {
            Database.connection.query(query, (updateError: mysql.MysqlError, result: mysql.OkPacket) => {
                if (updateError) {
                    reject(new DatabaseError(updateError));
                } else {
                    resolve(result);
                }
            });
        });
    }

    public static async delete(record: BaseModel | string): Promise<mysql.OkPacket> {
        const recordId = record instanceof BaseModel ? record.Id : record;
        if (!recordId?.length) {
            throw new DatabaseError(Constants.ERROR_MESSAGES.CANNOT_DELETE_RECORD_WITHOUT_ID);
        }
        const table = record.constructor.name;
        const id = recordId;
        const query = mysql.format('DELETE FROM ?? WHERE Id = ?;', [table, id]);
        console.log(query);
        return new Promise<mysql.OkPacket>((resolve, reject) => {
            Database.connection.query(query, (deleteError: mysql.MysqlError, result: mysql.OkPacket) => {
                if (deleteError) {
                    reject(new DatabaseError(deleteError));
                } else {
                    resolve(result);
                }
            });
        });
    }
}
