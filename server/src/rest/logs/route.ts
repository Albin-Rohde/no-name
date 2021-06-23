import { Router, Request, Response } from 'express'
import {loginRequired, gameRequired, handleRestError} from '../authenticate'
import {RestResponse} from "../types";
import * as fs from 'fs';
import {getLogs, logger} from "../../logger";
import * as readline from "readline";

const logRouter = Router()

//logRouter.use(loginRequired)

logRouter.get('/combined', async (req: Request, res: Response) => {
  try {
    const logs = await getLogs('combined.log')
    const response: RestResponse<Record<string, any>> = {
      ok: true,
      err: null,
      data: { logs }
    }
    return res.json(response)
  } catch (err) {
    handleRestError(req, res, err);
  }
})

logRouter.get('/error', async (req: Request, res: Response) => {
  try {
    const logs = await getLogs('error.log')
    const response: RestResponse<Record<string, any>> = {
      ok: true,
      err: null,
      data: { logs }
    }
    return res.json(response)
  } catch (err) {
    handleRestError(req, res, err);
  }
})

export default logRouter
