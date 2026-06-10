import express, { json, urlencoded } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import path from 'path'
import router from './routes/index.js'

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(morgan('dev'))
app.use(helmet())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(router)
app.use(express.static(path.join(__dirname, 'public')))

app.listen(port, () => {
  console.log(`server is listening on port: http://localhsost:${port}`)
})
