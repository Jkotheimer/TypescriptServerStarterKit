import User from '@models/user';

export default class UserRepository {
    public static getUserForAuthentication(email: string): User {
        const user = new User();
        user.Email = email;
        return user;
    }
}
