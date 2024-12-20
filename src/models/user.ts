/**
 * User data model representation
 */
import { v4 as uuidv4 } from 'uuid';
import Constants from '@constants';

export default class User {
    Id?: string;
    FirstName?: string;
    LastName?: string;
    Email?: string;
    Phone?: string;
    Role?: string;

    /**
     * ------------------------------------------
     * ------------ STATIC FACTORIES ------------
     * ------------------------------------------
     */

    /**
     * @description Build a User instance from a database row
     * @param record Database row
     * @returns User instance
     */
    public static fromRecord(record: Record<string, any>): User {
        return {
            Id: record.Id,
            FirstName: record.FirstName,
            LastName: record.LastName,
            Email: record.Email,
            Phone: record.Phone,
            Role: record.Role,
        } as User;
    }

    /**
     * ------------------------------------------
     * ------------ PUBLIC METHODS --------------
     * ------------------------------------------
     */

    public generateId(): void {
        if (this.Id?.length) {
            throw new Error(Constants.ERRORS.USER_ALREADY_HAS_ID);
        }
        this.Id = uuidv4();
    }
}
