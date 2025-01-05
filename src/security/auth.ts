import Constants from '@constants';
import User from '@models/user';
import UserRepository from '@database/repositories/user';
import Crypto from '@security/crypto';

export default class Auth {
    public static async validateUserCredentials(inputUser: User): Promise<void> {
        const user = await UserRepository.getUserForAuthentication(inputUser.Email);
        if (!user.Password || !Crypto.verifyPassword(inputUser.Password, user.Password)) {
            throw new Error(Constants.ERROR_MESSAGES.INVALID_USER_CREDENTIALS);
        }
    }

    public static async issueJwt(userId: string) {

    }
}
