import {Repository, SelectQueryBuilder} from "typeorm";
import {ColumnMetadata} from "typeorm/metadata/ColumnMetadata";
import {Game} from "../game/models/Game";
import {User} from "../user/models/User";
import {GameTurn} from "../game/models/GameTurn";
import {CardDeck} from "../deck/models/CardDeck";
import {CardDeckUserRef} from "../deck/models/CardDeckUserRef";
import {BlackCard} from "../card/models/BlackCard";
import {BlackCardRef} from "../card/models/BlackCardRef";
import {WhiteCard} from "../card/models/WhiteCard";
import {CardState, WhiteCardRef} from "../card/models/WhiteCardRef";
import {deleteGameFromUser} from "../game/services";
import {getUserWithRelation} from "../user/services";

interface ModelRow {
  name: string;
  value: any;
  link?: string;
}

export interface TableData {
  description: string;
  columns: string[];
  rows: ModelRow[][];
}


export interface DetailsTableData {
  model: string;
  columns: string[];
  row: ModelRow[];
  id: string;
}

export interface DetailsData {
  detailsTable: DetailsTableData,
  tableData: TableData[],
}

export const MODELS = [
  User,
  Game,
  GameTurn,
  CardDeck,
  CardDeckUserRef,
  BlackCard,
  BlackCardRef,
  WhiteCard,
  WhiteCardRef,
]

export type AnyModel = User
  | Game
  | GameTurn
  | CardDeck
  | CardDeckUserRef
  | BlackCard
  | BlackCardRef
  | WhiteCard
  | WhiteCardRef

export const getModel = <T=AnyModel>(name: string): Repository<T> => {
  return MODELS.find((m) => m.name === name).getRepository() as unknown as Repository<T>
}

export const getModelData = async (modelName: string): Promise<TableData[]> => {
  const model = getModel(modelName);
  return [{
    description: modelName,
    columns: getColumnNames(model),
    rows: await getModelRowFromQuery(model, model.createQueryBuilder()),
  }];
}

export const getModelDetails = async (modelName: string, id: string): Promise<DetailsData> => {
  const model = getModel(modelName);
  const tableData = await getTableData(model, id);
  const row = transformSingleRow(model, await model.findOne(id));
  const details: DetailsTableData = {
    model: modelName,
    columns: getColumnNames(model),
    row,
    id,
  }
  return {
    detailsTable: details,
    tableData,
  }
}

export const deleteModel = async (modelName: string, id: string): Promise<void> => {
  const model = getModel(modelName);
  if (modelIs<Game>(model, 'Game')) {
    const game = await model.findOneOrFail(id);
    const hostUser = await User.findOne(game.hostUserId);
    return deleteGameFromUser(hostUser);
  }
  if (modelIs<User>(model, 'User')) {
    const user = await model.findOne(id, );
    if (user.game_fk) {
      const game = await Game.findOneOrFail(user.game_fk);
      const hostUser = await User.findOneOrFail(game.hostUserId, {relations: ['game']});
      await deleteGameFromUser(hostUser);
    }
    await CardDeckUserRef.createQueryBuilder('cdr')
      .leftJoin(User, 'u', 'u.id = cdr.user_id_fk')
      .where('u.id = :id', {id})
      .delete()
      .execute();
    await model.delete(id);
    return;
  }
  await model.delete(id);
}

// @ts-ignore
const modelIs = <T=AnyModel>(model: Repository<AnyModel>, name: string): model is Repository<T> => {
  return (model as unknown as Repository<T>).metadata.name === name;
}

const getColumnNames = (model: Repository<AnyModel>): string[] => {
  return model.metadata.columns.map((c) => {
    if (c.propertyName === 'card_wizz_user_id_fk') {
      return 'card wizz for turn';
    }
    return c.propertyName;
  });
}

const getGenericColumnLink = (coll: ColumnMetadata, row: any): string | undefined => {
  if (coll.relationMetadata?.inverseEntityMetadata.targetName) {
    return `/${coll.relationMetadata.inverseEntityMetadata.targetName}/details/${row[coll.propertyName]}`
  }
  if (coll.isPrimary) {
    return `/${coll.entityMetadata.targetName}/details/${row[coll.propertyName]}`
  }
  if (coll.propertyName === 'hostUserId') {
    return `/User/details/${row[coll.propertyName]}`
  }
  if (coll.propertyName === 'game_key') {
    return `/Game/details/${row[coll.propertyName]}`
  }
  if (coll.propertyName === 'currentTurn') {
    return `/GameTurn/details/${row.currentTurn}`
  }
  return undefined
}

const transformSingleRow = <T=AnyModel>(model: Repository<T>, row: any): ModelRow[] => {
  const columnData: ModelRow[] = []
  for (const coll of model.metadata.columns) {
    switch (coll.propertyName) {
      case 'password':
        columnData.push({
          name: 'password',
        value: 'change password',
        link: `/User/change-password/${row.id}`,
        });
        break;
      case 'card_wizz_user_id_fk':
        columnData.push({
          name: 'card_wizz',
          value: row.cardWizz ? row.cardWizz.username : row.card_wizz_user_id_fk,
          link: getGenericColumnLink(coll, row),
        })
        break;
      case 'created_at' || 'deleted_at':
        columnData.push({
          name: coll.propertyName,
          value: row[coll.propertyName].toLocaleDateString('se-SV'),
        });
        break;
      default:
        columnData.push({
          name: coll.propertyName,
          value: row[coll.propertyName],
          link: getGenericColumnLink(coll, row),
        });
        break;
    }
  }
  return columnData;
}

const getModelRowFromQuery = async <T=AnyModel>(model: Repository<T>, query: SelectQueryBuilder<T>): Promise<ModelRow[][]> => {
  const rows: ModelRow[][] = []
  for (const row of await query.getMany()) {
    rows.push(transformSingleRow<T>(model, row))
  }
  return rows;
}

const gameTableData = async (id: string): Promise<TableData[]> => {
  const usersInGameQ = User.createQueryBuilder('u')
    .where('u.game_fk = :id', {id});
  const currentWizzQ = User.createQueryBuilder('u')
    .leftJoin('game', 'g', 'key = :id', {id})
    .leftJoin('game_turn', 'gt', 'gt.card_wizz_user_id_fk = u.id')
    .where('u.game_fk IS NOT NULL and gt.id = g.current_turn_fk');
  const gameTurnRows = await GameTurn.find({
    where: {game_key: id},
    order: {turn_number: 'ASC'},
    relations: ['cardWizz']
  });
  const userRepo = User.getRepository()
  return [
    {
      description: 'Current card wizz',
      columns: getColumnNames(userRepo),
      rows: await getModelRowFromQuery(userRepo, currentWizzQ)
    },
    {
      description: 'Users in in game',
      columns: getColumnNames(userRepo),
      rows: await getModelRowFromQuery(userRepo, usersInGameQ)
    },
    {
      description: 'Game turns',
      columns: getColumnNames(GameTurn.getRepository()),
      rows: gameTurnRows.map((r) => transformSingleRow<GameTurn>(GameTurn.getRepository(), r)),
    }
  ]
}

const getTableData = async (model: Repository<AnyModel>, id: string): Promise<TableData[]> => {
  const tableData: TableData[] = [];
  if (modelIs<Game>(model, 'Game')) {
    tableData.push(...await gameTableData(id))
  }
  if (modelIs<BlackCardRef>(model, 'BlackCardRef')) {
    const bref = await model.findOne({where: {id}, relations: ['blackCard']});
    tableData.push({
      description: 'black card text',
      columns: ['card text'],
      rows: [[{
        name: 'card text',
        value: bref.blackCard.text,
      }]]
    })
  }
  if (modelIs<User>(model, 'User')) {
    const user = await getUserWithRelation(parseInt(id));
    if (user.game_fk) {
      const cardsOnHand = user.cards.filter((c) => c.state === CardState.HAND);
      const rows: ModelRow[][] = cardsOnHand.map<ModelRow[]>((card) => {
        return [
          {name: 'id', value: card.id, link: `/WhiteCardRef/${card.id}`},
          {name: 'WhiteCard', value: card.white_card.id, link: `/WhiteCard/details/${card.white_card.id}`},
          {name: 'text', value: card.white_card.text}
        ]
      })
      tableData.push({
        description: 'Cards on hand',
        columns: ['WhiteCardRef', 'WhiteCard', 'card text'],
        rows,
      })
    }
  }
  return tableData;
}
