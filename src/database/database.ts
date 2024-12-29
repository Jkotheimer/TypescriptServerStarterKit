import { DatabaseError } from '@models/errors';
import BaseModel from '@models/base';
import mysql from 'mysql';
import Constants from '@constants';

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
        return new Promise<mysql.OkPacket>((resolve, reject) => {
            Database.connection.beginTransaction(async (transactionError: mysql.MysqlError) => {
                if (transactionError) {
                    return reject(new DatabaseError(transactionError));
                }
                const table = record.constructor.name;
                const recordClone = await record.createQuerySafeClone();
                const query = mysql.format('INSERT INTO ?? SET ?;', [table, recordClone]);
                console.log(query);
                Database.connection.query(query, (insertError: mysql.MysqlError, result: mysql.OkPacket) => {
                    if (insertError) {
                        Database.connection.rollback(() => reject(new DatabaseError(insertError)));
                    } else {
                        Database.connection.commit((commitError: mysql.MysqlError) => {
                            if (commitError) {
                                reject(new DatabaseError(commitError));
                            } else {
                                resolve(result);
                            }
                        });
                    }
                });
            });
        });
    }

    public static async update(record: BaseModel): Promise<mysql.OkPacket> {
        return new Promise<mysql.OkPacket>((resolve, reject) => {
            if (!record?.Id) {
                return reject(new DatabaseError(Constants.ERROR_MESSAGES.CANNOT_UPDATE_RECORD_WITHOUT_ID));
            }
            Database.connection.beginTransaction(async (transactionError: mysql.MysqlError) => {
                if (transactionError) {
                    return reject(new DatabaseError(transactionError));
                }
                const table = record.constructor.name;
                const recordClone = await record.createQuerySafeClone();
                const query = mysql.format('UPDATE ?? SET ? WHERE Id = ?', [table, recordClone, record.Id]);
                console.log(query);
                Database.connection.query(query, (updateError: mysql.MysqlError, result: mysql.OkPacket) => {
                    if (updateError) {
                        Database.connection.rollback(() => reject(new DatabaseError(updateError)));
                    } else {
                        Database.connection.commit((commitError: mysql.MysqlError) => {
                            if (commitError) {
                                reject(new DatabaseError(commitError));
                            } else {
                                console.log('UPDATE RESULT:', result);
                                resolve(result);
                            }
                        });
                    }
                });
            });
        });
    }

    public static async delete(record: BaseModel | string): Promise<mysql.OkPacket> {
        return new Promise<mysql.OkPacket>((resolve, reject) => {
            const recordId = record instanceof BaseModel ? record.Id : record;
            if (!recordId?.length) {
                return reject(new DatabaseError(Constants.ERROR_MESSAGES.CANNOT_DELETE_RECORD_WITHOUT_ID));
            }
            Database.connection.beginTransaction(async (transactionError) => {
                if (transactionError) {
                    return reject(new DatabaseError(transactionError));
                }
                const table = record.constructor.name;
                const id = recordId;
                const query = mysql.format('DELETE FROM ?? WHERE Id = ?;', [table, id]);
                console.log(query);
                Database.connection.query(query, (deleteError: mysql.MysqlError, result: mysql.OkPacket) => {
                    if (deleteError) {
                        Database.connection.rollback(() => reject(new DatabaseError(deleteError)));
                    } else {
                        Database.connection.commit((commitError: mysql.MysqlError) => {
                            if (commitError) {
                                reject(new DatabaseError(commitError));
                            } else {
                                console.log('Successfully deleted', record, result);
                                resolve(result);
                            }
                        });
                    }
                });
            });
        });
    }
}
