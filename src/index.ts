import express from 'express'
import cors from 'cors'
import { usersRouter } from './routers/usersRouter'
import { postsRouter } from './routers/postsRouter'
import dotenv from 'dotenv'
import { commentsRouter } from './routers/commentsRouter'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.listen(Number(process.env.PORT), () => {
    console.log(`Servidor rodando na porta ${Number(process.env.PORT)}`)
})

app.use("/users", usersRouter)
app.use("/posts", postsRouter)
app.use("/comments",commentsRouter)











