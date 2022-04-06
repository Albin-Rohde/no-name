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
import {adminRequired} from "../middlewares";
import {loginSchema, updateSchema} from "../user/schema";
import {loginUser, updateUser} from "../user/services";
import {ValidationError} from "yup";
import {logger} from "../logger/logger";

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

const adminRouter = Router();

adminRouter.get('/login', (req: Request, res: Response) => {
  if(req.session.user.admin) {
    res.redirect('/admin')
  }
  return res.render('login', {err: req.query.err, layouts: false})
})

adminRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const input = loginSchema.validateSync(req.body);
    const user = await loginUser(input);
    if (!user.admin) {
      return res.redirect('/admin/login')
    }
    req.session.user = user;
    req.session.save();
    res.redirect('/admin');
  } catch (err) {
    handleAdminError(req, res, err);
  }
});

adminRouter.use(adminRequired);

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
  res.render('model_details', {
    model: modelName,
    columns: getColumnNames(model),
    row: await getSingleRow(model, id),
    id,
  });
});


export {adminRouter}