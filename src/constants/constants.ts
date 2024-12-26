export default class Constants {
    public static readonly PORT: number = 8080;
    public static readonly ENCODING_SCHEME = 'base64url';

    public static readonly CRYPTO = class {
        public static readonly HASH_SALT_ROUNDS = 13;
        public static readonly JWT_ALGORITHM = 'hmacSHA512';
    };

    public static readonly ERRORS = class {
        public static readonly USER_ALREADY_HAS_ID = 'This User already has an Id';
        public static readonly FIELD_DOES_NOT_EXIST = 'The field "{0}" does not exist on the "{1}" table.';
    };
}
