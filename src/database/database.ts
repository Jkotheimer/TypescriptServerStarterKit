import mysql from 'mysql';

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
    public static async query(query: string): Promise<Array<Record<string, any>>> {
        return new Promise<Array<Record<string, any>>>((resolve, reject) => {
            Database.connection.query(query, (error, results, fields) => {
                console.log(fields);
                console.log(results);
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
}
