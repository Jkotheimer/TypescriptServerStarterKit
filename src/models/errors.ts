import { MysqlError } from 'mysql';
import Constants from '@constants';

export class RequestError extends Error {
    public errorCode: string;
    public statusCode?: number;
    constructor(errorCode: string, errorMessage: string) {
        super(errorMessage);
        this.errorCode = errorCode;
        if (errorCode in Constants.HTTP_STATUS_CODES) {
            this.statusCode = (Constants.HTTP_STATUS_CODES as any)[errorCode];
        }
    }
}

export class DatabaseError implements MysqlError {
    code: string;
    errno: number;
    sqlMessage?: string | undefined;
    sqlState?: string | undefined;
    sql?: string | undefined;
    stack?: string | undefined;
    fatal: boolean;
    name: string;
    message: string;

    constructor(error: string | MysqlError) {
        if (typeof error === 'string') {
            this.message = error;
            this.code = Constants.MYSQL_ERROR_CODES.ER_UNKNOWN;
            this.errno = -1;
            this.sqlMessage = error;
            this.fatal = true;
            this.name = 'DatabaseError';
        } else {
            this.message = error.message;
            this.code = error.code;
            this.errno = error.errno;
            this.sqlMessage = error.sqlMessage;
            this.sqlState = error.sqlState;
            this.sql = error.sql;
            this.stack = error.stack;
            this.fatal = error.fatal;
            this.name = error.name;
        }
    }
}
