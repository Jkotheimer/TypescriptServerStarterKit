import User from '@models/user';

export default class UserRepository {
    public static getUser(id: string): User {
        const user = new User();
        user.Id = id;
        return user;
    }
}
