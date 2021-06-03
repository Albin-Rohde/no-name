import {Request, Response, Router} from "express";
import * as crypto from 'crypto';

const github = Router()

github.post('/no-name', async (req: Request, res: Response) => {
  //const secret = Buffer.from(process.env.GITHUB_WEBHOOK_SECRET, 'utf8')
  const hash = crypto.createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET)
  hash.update(req.rawBody)
  console.log({
    host: req.hostname,
    secure: req.secure,
    authInfo: req.authInfo,
    headers: req.headers,
    sha256: 'sha256='+hash.digest('hex'),
  })
  req.read()
  return res.status(200).send();
})

export { github }
