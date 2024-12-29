import { DatabaseError, RequestError } from '@models/errors';
import Database from '@database/database';
import Constants from '@constants';
import User from '@models/user';
import Crypto from '@security/crypto';
import StringUtils from '@utils/string';

const CLIENT_VISIBLE_FIELDS = ['FirstName', 'LastName', 'Email', 'Phone', 'CreatedDate', 'EmailVerified', 'IsActive', 'LastModifiedDate', 'ActivatedDate'];

const CREATEABLE_FIELDS = ['FirstName', 'LastName', 'Email', 'Phone', 'Password'];
const REQUIRED_CREATE_FIELDS = ['Email', 'Password'];

const UPDATEABLE_FIELDS = ['FirstName', 'LastName', 'Email', 'Phone'];

export default class UserRepository {
    public static async getUserForAuthentication(email: string): Promise<User> {
        email = Database.connection.escape(email);
        const userRecords = await Database.query(`SELECT Id, Email, Password FROM User WHERE Email = '${email}' LIMIT 1;`);
        if (!userRecords.length) {
            const errorMessage = StringUtils.format(Constants.ERROR_MESSAGES.USER_NOT_FOUND, ['email']);
            throw new RequestError(Constants.ERROR_CODES.NOT_FOUND, errorMessage);
        }
        const user = await User.from(userRecords[0]);
        console.log(user);
        return user;
    }

    public static async getUserDetails(id: string): Promise<User> {
        const userRecords = await Database.query(`SELECT ${CLIENT_VISIBLE_FIELDS.join(',')} FROM User WHERE Id = ? LIMIT 1;`, [id]);
        if (!userRecords.length) {
            const errorMessage = StringUtils.format(Constants.ERROR_MESSAGES.USER_NOT_FOUND, ['id']);
            throw new RequestError(Constants.ERROR_CODES.NOT_FOUND, errorMessage);
        }
        console.log('User Record:', userRecords);
        const user = await User.from(userRecords[0]);
        console.log(user);
        return user;
    }

    public static async createUser(user: User): Promise<User> {
        // Ensure all provided fields are createable and all required fields are present
        const invalidFields = [];
        const requiredFields = [...REQUIRED_CREATE_FIELDS];
        for (const field of Object.keys(user)) {
            if (!CREATEABLE_FIELDS.includes(field)) {
                invalidFields.push(field);
            }
            const requiredFieldIndex = requiredFields.indexOf(field);
            if (requiredFieldIndex >= 0) {
                requiredFields.splice(requiredFieldIndex, 1);
            }
        }
        if (invalidFields.length) {
            const pluralStr = invalidFields.length > 1 ? 's' : '';
            const errorMessage = StringUtils.format(Constants.ERROR_MESSAGES.INVALID_FIELDS, [pluralStr, invalidFields.join(', ')]);
            throw new RequestError(Constants.ERROR_CODES.BAD_REQUEST, errorMessage);
        }
        if (requiredFields.length) {
            const pluralStr = requiredFields.length > 1 ? 's' : '';
            const errorMessage = StringUtils.format(Constants.ERROR_MESSAGES.REQUIRED_FIELDS_MISSING, [pluralStr, requiredFields.join(', ')]);
            throw new RequestError(Constants.ERROR_CODES.BAD_REQUEST, errorMessage);
        }
        try {
            user.Password = await Crypto.hashPassword(user.Password!);

            // Insert the user record, apply the new record id, and clear out the password before returning the new user record
            const result = await Database.insert(user);

            user.Id = result.insertId.toString();
            user.Password = undefined;

            return user;
        } catch (error) {
            if (error instanceof DatabaseError) {
                // Override default MySQL error messages with more user-friendly custom error messages
                switch (error.code) {
                    case Constants.MYSQL_ERROR_CODES.ER_DUP_ENTRY:
                        error.message = Constants.ERROR_MESSAGES.USER_ALREADY_EXISTS;
                    default:
                        break;
                }
            }
            throw error;
        }
    }

    public static async updateUser(user: User): Promise<User> {
        const invalidFields = [];
        for (const field of Object.keys(user).filter((f) => f !== 'Id')) {
            if (!UPDATEABLE_FIELDS.includes(field)) {
                invalidFields.push(field);
            }
        }
        if (invalidFields.length) {
            const pluralStr = invalidFields.length > 1 ? 's' : '';
            const errorMessage = StringUtils.format(Constants.ERROR_MESSAGES.INVALID_FIELDS, [pluralStr, invalidFields.join(', ')]);
            throw new RequestError(Constants.ERROR_CODES.BAD_REQUEST, errorMessage);
        }

        const result = await Database.update(user);
        if (result.affectedRows === 0) {
            const errorMessage = StringUtils.format(Constants.ERROR_MESSAGES.USER_NOT_FOUND, ['id']);
            throw new RequestError(Constants.ERROR_CODES.NOT_FOUND, errorMessage);
        }
        return user;
    }

    public static async deleteUser(user: User | string): Promise<User> {
        if (typeof user === 'string') {
            const userId = user;
            user = await User.from({ Id: userId });
        }
        const result = await Database.delete(user);
        console.log('DELETE RESULT:', result);
        return user;
    }

    public static async deactivateUser(user: User | string): Promise<User> {
        if (typeof user === 'string') {
            const userId = user;
            user = await User.from({ Id: userId, IsActive: false });
        }
        const result = await Database.update(user);
        if (result.affectedRows === 0) {
            const errorMessage = StringUtils.format(Constants.ERROR_MESSAGES.USER_NOT_FOUND, ['id']);
            throw new RequestError(Constants.ERROR_CODES.NOT_FOUND, errorMessage);
        }
        return user;
    }
}
