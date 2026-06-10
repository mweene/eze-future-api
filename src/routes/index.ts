import { Router } from "express"
import { 
  defaultRoute, 
  getAllClients,
  catchAllRoutes,
} from "../controllers/index.js"

const router:Router = Router()

//default route
router.get('/', defaultRoute)

//client routes
router.get('/api/clients', getAllClients)

//catch all routes
router.get('*catchall', catchAllRoutes);

export default router
