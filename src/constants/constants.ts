export default class Constants {
    public static readonly PORT: number = 8080;
    public static readonly ENCODING_SCHEME = 'base64url';

    public static readonly DB = class {
        public static readonly BOOLEAN_TYPE = 'tinyint(1)';
    };

    public static readonly CRYPTO = class {
        public static readonly HASH_SALT_ROUNDS = 13;
        public static readonly JWT_ALGORITHM = 'hmacSHA512';
    };

    public static readonly HTTP_STATUS_CODES = class {
        public static readonly OK = 200;
        public static readonly CREATED = 201;
        public static readonly BAD_REQUEST = 400;
        public static readonly UNAUTHORIZED = 401;
        public static readonly FORBIDDEN = 403;
        public static readonly NOT_FOUND = 404;
        public static readonly CONFLICT = 409;
        public static readonly THROTTLED = 429;
        public static readonly INTERNAL_SERVER_ERROR = 500;
    };

    public static readonly ERROR_CODES = class {
        public static readonly INVALID_API_VERSION = 'INVALID_API_VERSION';
        public static readonly UNAUTHORIZED = 'UNAUTHORIZED';
        public static readonly BAD_REQUEST = 'BAD_REQUEST';
        public static readonly NOT_FOUND = 'NOT_FOUND';
        public static readonly CONFLICT = 'CONFLICT';
        public static readonly THROTTLED = 'THROTTLED';
        public static readonly INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR';
    };

    public static readonly ERROR_MESSAGES = class {
        public static readonly INVALID_API_VERSION = 'Invalid API Version: {0}.';
        public static readonly UNEXPECTED = 'An unexpected error occurred.';
        public static readonly FIELD_DOES_NOT_EXIST = 'The field "{0}" does not exist on the "{1}" table.';
        public static readonly INVALID_FIELDS = 'Invalid field{0}: [ {1} ]';
        public static readonly INVALID_USER_CREDENTIALS = 'Invalid email/password. Please check your credentials and try again.';
        public static readonly USER_ALREADY_HAS_ID = 'This User already has an Id.';
        public static readonly USER_ALREADY_EXISTS = 'A user with the provided email already exists.';
        public static readonly USER_NOT_FOUND = 'Unable to find a user with the provided {0}.';
        public static readonly REQUIRED_FIELDS_MISSING = 'Missing required field{0}: {1}';
        public static readonly CANNOT_DELETE_RECORD_WITHOUT_ID = 'Cannot delete a record that does not have an Id.';
        public static readonly CANNOT_UPDATE_RECORD_WITHOUT_ID = 'Cannot update a record that does not have an Id.';
    };

    public static readonly MYSQL_ERROR_CODES = class {
        public static readonly ER_UNKNOWN = 'ER_UNKNOWN';
        public static readonly ER_DUP_ENTRY = 'ER_DUP_ENTRY';
    };
}
