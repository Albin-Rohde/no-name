import { Router, Request, Response } from 'express'
import {loginRequired, handleRestError} from '../middlewares'
import {RestResponse} from "../types";
import {getLogs} from "./logger";

const logRouter = Router()

logRouter.use(loginRequired)

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

logRouter.get('/requests', async (req: Request, res: Response) => {
  try {
    const logs = await getLogs('requests.log')
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

logRouter.get('/socket', async (req: Request, res: Response) => {
  try {
    const logs = await getLogs('socket.log')
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
