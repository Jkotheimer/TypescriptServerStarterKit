import mysql from 'mysql';

export default class Database {
    public static connection: mysql.Connection;
    static {
        const connection = mysql.createConnection({});
    }
    public static async query(query: string): Promise<Array<Record<string, any>>> {
        return new Promise<Array<Record<string, any>>>((resolve, reject) => {
            Database.connection.query(query, (error, results, fields) => {
                console.log(fields);
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
}
