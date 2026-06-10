import type { Request, Response } from 'express'
import path from 'path'

const defaultRoute = (req:Request, res:Response) => {
  const filePath = path.join(process.cwd(), 'src', 'index.html')
  res.status(200).sendFile(filePath)
}

//sample clients
const clients = [
  {id: '23', name: 'morgan brown'},
  {id: '11', name: 'lawrence kunda'}
]

const getAllClients = (req:Request, res:Response) => {
  try {
    res.status(200).json({data: clients})
  } catch (err: unknown) {
    res.status(500).json({error: err.message})
  }
}

//catch all
const catchAllRoutes = (req:Request, res:Response) => {
  res.send('all unkown routes here');
}

export {
  defaultRoute,
  getAllClients,
  catchAllRoutes,
}
