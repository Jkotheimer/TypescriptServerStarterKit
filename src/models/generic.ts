import Constants from '@constants';

export default class GenericModel {
    public id?: string;

    public constructor(record: Record<string, any>) {
        const classFields = Object.getOwnPropertyNames(this);
        Object.keys(record).forEach((key) => {
            const convertedKey = key.replace(/_x$/, '') as keyof GenericModel;
            if (!classFields.includes(convertedKey)) {
                throw new Error(Constants.ERRORS.FIELD_DOES_NOT_EXIST);
            }
            this[convertedKey] = record[key];
        });
    }
}
