import Database from '@database/database';

const GlobalDescribe: Record<string, TableDescribe> = {};
export default GlobalDescribe;

export class FieldDescribe {
    name: string;
    type: string;
    nillable: boolean;

    constructor(describeRow: Record<string, any>) {
        this.name = describeRow.Field;
        this.type = describeRow.Type;
        this.nillable = describeRow.Null === 'YES';
    }
}

export class TableDescribe {
    public table: string;
    public fields: FieldDescribe[];

    constructor(table: string, fields: FieldDescribe[]) {
        this.table = table;
        this.fields = fields;
    }

    public static async fetch(table: string): Promise<TableDescribe> {
        console.log('Fetching describe');
        const fieldDescribes = await Database.query('DESCRIBE ??;', [table]);
        console.log('Field describes:', fieldDescribes);
        return new TableDescribe(
            table,
            fieldDescribes.map((fd) => new FieldDescribe(fd))
        );
    }
}
