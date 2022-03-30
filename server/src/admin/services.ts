import {Repository} from "typeorm";
import {ColumnMetadata} from "typeorm/metadata/ColumnMetadata";

export const getColumnNames = (model: Repository<any>): string[] => {
  const columns = model.metadata.columns
  return columns.map(c => c.propertyName);
}

interface ModelRow {
  name: string;
  value: any;
  link?: string;
}
export const getModelRows = async (model: Repository<any>): Promise<ModelRow[][]> => {
  const rows: ModelRow[][] = []
  for (const row of await model.find()) {
    const columnData: ModelRow[] = [];
    for(const coll of model.metadata.columns) {
      columnData.push({
        name: coll.propertyName,
        value: row[coll.propertyName],
        link: getColumnLink(coll, row),
      });
    }
    rows.push(columnData);
  }
  return rows;
}

export const getColumnLink = (coll: ColumnMetadata, row: any): string | undefined => {
  if (coll.relationMetadata?.inverseEntityMetadata.targetName) {
    return `/admin/${coll.relationMetadata.inverseEntityMetadata.targetName}/details/${row[coll.propertyName]}`
  }
  if (coll.isPrimary) {
    return `/admin/${coll.entityMetadata.targetName}/details/${row[coll.propertyName]}`
  }
  if (coll.propertyName === 'hostUserId') {
    return `/admin/User/details/${row[coll.propertyName]}`
  }
  return undefined
}

export const getSingleRow = async (model: Repository<any>, id: string): Promise<ModelRow[]> => {
  const row = await model.findOne(id);
  const columnData: ModelRow[] = [];
  for(const coll of model.metadata.columns) {
    columnData.push({
      name: coll.propertyName,
      value: row[coll.propertyName],
      link: getColumnLink(coll, row),
    });
  }
  return columnData;
}