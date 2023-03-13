import express from "express"
import { UserBusiness } from "../business/UserBusiness"
import { UserController } from "../controller/userController"
import { UserDatabase } from "../database/UserDatabase"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"


export const usersRouter = express.Router()


const userController =  new UserController(
    new UserBusiness(
        new UserDatabase(),
        new IdGenerator(),
        new TokenManager(),
        new HashManager()
    )
)
usersRouter.post("/signup", userController.userSignup )
usersRouter.post("/login", userController.userLogin )

