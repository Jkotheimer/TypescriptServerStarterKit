/**
 * User data model representation
 */
import GenericModel from '@models/generic';
import Constants from '@constants';

export default class User extends GenericModel {
    Id?: string;
    FirstName?: string;
    LastName?: string;
    Email?: string;
    Phone?: string;
    Role?: string;
}
