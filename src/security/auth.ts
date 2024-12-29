import Constants from '@constants';
import UserRepository from '@database/user-repository';
import Crypto from '@security/crypto';

export default class Auth {
    public static async validateUserCredentials(email: string, password: string): Promise<void> {
        const user = await UserRepository.getUserForAuthentication(email);
        if (!user.Password || !Crypto.verifyPassword(password, user.Password)) {
            throw new Error(Constants.ERROR_MESSAGES.INVALID_USER_CREDENTIALS);
        }
    }
}
