import {Request, Response, Router} from "express";

const github = Router()

github.post('/no-name', async (req: Request, res: Response) => {
  console.log("RES\n", req.body)
  return res.status(200);
})

export { github }
