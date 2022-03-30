import { Router, Request, Response} from 'express';
import {User} from "../user/models/User";
import {Game} from "../game/models/Game";
import {CardDeck} from "../deck/models/CardDeck";
import {CardDeckUserRef} from "../deck/models/CardDeckUserRef";
import {BlackCard} from "../card/models/BlackCard";
import {BlackCardRef} from "../card/models/BlackCardRef";
import {GameTurn} from "../game/models/GameTurn";
import {WhiteCardRef} from "../card/models/WhiteCardRef";
import {WhiteCard} from "../card/models/WhiteCard";
import {getColumnNames, getModelRows, getSingleRow} from "./services";

const adminRouter = Router();

const MODELS = [
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

adminRouter.get('/', (req, res) => {
  const modelNames = MODELS.map((model) => {
    return model.name
  });
  res.render('home', {models: modelNames})
});

adminRouter.get('/:modelName', async (req: Request, res: Response) => {
  const modelName = req.params.modelName;
  const model = MODELS.find((m) => m.name === modelName).getRepository()
  res.render('model', {
    model: modelName,
    columns: getColumnNames(model),
    rows: await getModelRows(model),
  });
});

adminRouter.get('/:modelName/details/:id', async (req: Request, res: Response) => {
  const { modelName, id } = req.params;
  const model = MODELS.find((m) => m.name === modelName).getRepository()
  const row = await getSingleRow(model, id);
  console.log(row);
  res.render('model_details', {
    model: modelName,
    columns: getColumnNames(model),
    row: await getSingleRow(model, id),
    id,
  });
});


export {adminRouter}