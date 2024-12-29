import Constants from '@constants';
import StringUtils from '@utils/string';
import GlobalDescribe, { TableDescribe } from '@models/describe';

export default class BaseModel {
    public Id?: string;

    /**
     * @description Static factory method to generate a single base model instance
     * @param record Record input to generate model from
     * @returns {Promise<BaseModel>} Resolves the model instance
     */
    public static async from(record: Record<string, any>): Promise<BaseModel> {
        const tableDescribe = await this.getDescribe();
        const model = new this();
        Object.keys(record).forEach((key) => {
            const convertedKey = key.replace(/_x$/, '') as keyof BaseModel;
            console.log(convertedKey);
            const fieldDescribe = tableDescribe.fields.find((field) => field.name === convertedKey);
            if (!fieldDescribe) {
                throw new Error(StringUtils.format(Constants.ERROR_MESSAGES.FIELD_DOES_NOT_EXIST, [key, this.name]));
            }
            let value = record[key];
            if (fieldDescribe.type === Constants.DB.BOOLEAN_TYPE) {
                value = typeof value === 'boolean' ? value : value == 1;
            }
            model[convertedKey] = value;
        });
        return model;
    }

    /**
     * @description Get a describe for this table
     * @returns {Promise<TableDescribe>}
     */
    public async getDescribe(): Promise<TableDescribe> {
        if (!GlobalDescribe[this.constructor.name]) {
            GlobalDescribe[this.constructor.name] = await TableDescribe.fetch(this.constructor.name);
        }
        return GlobalDescribe[this.constructor.name];
    }

    /**
     * @description Get a describe for this table
     * @returns {Promise<TableDescribe>}
     */
    public static async getDescribe(): Promise<TableDescribe> {
        if (!GlobalDescribe[this.name]) {
            GlobalDescribe[this.name] = await TableDescribe.fetch(this.name);
        }
        return GlobalDescribe[this.name];
    }

    /**
     * ------------------------------------------
     * ------------- INSTANCE METHODS -----------
     * ------------------------------------------
     */

    /**
     * @description Clone this instance, but escape the string values of every property to be safe for a SQL query
     * @returns {Promise<BaseModel>}
     */
    public async createQuerySafeClone(): Promise<BaseModel> {
        const clone: Record<string, any> = {};
        const describe = await this.getDescribe();
        describe.fields.forEach((field) => {
            let value = this[field.name as keyof BaseModel];
            if (value == null) {
                return;
            }
            if (typeof value === 'string') {
                value = StringUtils.escapeSingleQuotes(value);
            }
            clone[field.name] = value;
        });
        return clone as BaseModel;
    }
}
