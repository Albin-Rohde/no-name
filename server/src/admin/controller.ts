import { Router, Request, Response} from 'express';
import {User} from "../user/models/User";
import {
  deleteModel,
  getModelData,
  getModelDetails,
  MODELS,
} from "./services";
import {adminRequired} from "../middlewares";
import {loginSchema, updateSchema} from "../user/schema";
import {loginUser, updateUser} from "../user/services";
import {ValidationError} from "yup";
import {logger} from "../logger/logger";

const adminRouter = Router();

adminRouter.get('/login', (req: Request, res: Response) => {
  if(req.session?.user?.admin) {
    res.redirect('/')
  }
  return res.render('login', {err: req.query.err, layouts: false})
})

adminRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const input = loginSchema.validateSync(req.body);
    const user = await loginUser(input);
    if (!user.admin) {
      return res.redirect('/login')
    }
    req.session.user = user;
    req.session.save();
    res.redirect('/');
  } catch (err) {
    handleAdminError(req, res, err);
  }
});

adminRouter.use(adminRequired);

adminRouter.get('/', async (req, res) => {
  const models = await Promise.all(MODELS.map(async (model) => {
    return {
      name: model.name,
      count: await model.count(),
    }
  }));
  res.render('home', {models})
});

adminRouter.get('/:modelName', async (req: Request, res: Response) => {
  const modelName = req.params.modelName;
  const tableData = await getModelData(modelName);
  console.log(tableData);
  res.render('model', {tableData})
});

adminRouter.delete('/:modelName/:id', async (req: Request, res: Response) => {
  const {modelName, id} = req.params;
  await deleteModel(modelName, id);
  return res.status(202).json({ok: true})
})

adminRouter.get('/:modelName/details/:id', async (req: Request, res: Response) => {
  const { modelName, id } = req.params;
  const details = await getModelDetails(modelName, id);
  res.render('model_details', details)
});

adminRouter.get('/User/change-password/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findOneOrFail(req.params.id);
    return res.render('change-password', {...user, err: req.query.err})
  } catch (err) {
    handleAdminError(req, res, err);
  }
});

adminRouter.post('/User/change-password/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findOneOrFail(req.params.id);
    const {password1, password2} = req.body;
    if (password1 !== password2) {
      throw new ValidationError('password missmatch');
    }
    const input = updateSchema.validateSync({password: password1, id: user.id});
    await updateUser(input);
    return res.redirect(`/User/details/${user.id}`);
  } catch (err) {
    handleAdminError(req, res, err);
  }
});


function handleAdminError(req: Request, res: Response, err: Error) {
  if (err instanceof ValidationError) {
    logger.warn(err);
    return res.redirect(`/${req.path}?err=${err.message}`);
  } else {
    return res.redirect(req.path);
  }
}

export {adminRouter}