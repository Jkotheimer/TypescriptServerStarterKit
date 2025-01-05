/**
 * User data model representation
 */
import BaseModel from '@models/base';


export default class User extends BaseModel {
    public Id?: string;
    public FirstName?: string;
    public LastName?: string;
    public Email?: string;
    public Phone?: string;
    public Role?: string;
    public Password?: string;
    public Deleted?: boolean;
    public EmailVerified?: boolean;
    public CreatedDate?: Date;
    public LastModifiedDate?: Date;
    public ActivatedDate?: Date;

    public static async from(data: any): Promise<User> {
        return (await super.from(data)) as User;
    }

    public static readonly Actions = class {
        public static readonly AUTH = 'USER_AUTH';
        public static readonly READ = 'USER_READ';
        public static readonly CREATE = 'USER_CREATE';
        public static readonly UPDATE = 'USER_UPDATE';
    }
}
