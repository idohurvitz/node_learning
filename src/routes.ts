
import { Express, Request, Response } from 'express'



function routes(app: Express) {
    app.get("/test", (req: Request, res: Response) => res.send('test'));

}

export default routes