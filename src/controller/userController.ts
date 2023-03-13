import { Request, Response } from "express"
import { UserBusiness } from "../business/UserBusiness"
import { LoginInputDTO, SignupInputDTO } from "../dtos/userDTO"
import { BaseError } from "../error/BaseError"



export class UserController {
    constructor(
        private userBusiness: UserBusiness
    ){}

    public userSignup = async (req: Request, res: Response) => {
        try {
            const input: SignupInputDTO ={
                name: req. body.name, 
                email: req.body.email, 
                password: req.body.password
            }
            
            const output = await this.userBusiness.userSignup (input)
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",input)

            console.log("GABRIEEEEEEEEEELLLLLL",output)
            res.status(201).send(output)

        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public userLogin = async (req: Request, res: Response) =>{
        try {
            const input: LoginInputDTO = {
                email: req.body.email,
                password: req.body.password
            }
            const output = await this.userBusiness.userLogin(input)
            res.status(200).send(output)
            
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
}