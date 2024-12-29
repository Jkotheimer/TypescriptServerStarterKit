/**
 * User data model representation
 */
import BaseModel from '@models/base';

export default class User extends BaseModel {
    Id?: string;
    FirstName?: string;
    LastName?: string;
    Email?: string;
    Phone?: string;
    Role?: string;
    Password?: string;
    Deleted?: boolean;
    EmailVerified?: boolean;
    CreatedDate?: Date;
    LastModifiedDate?: Date;
    ActivatedDate?: Date;
}
