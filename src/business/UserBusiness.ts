import { UserDatabase } from "../database/UserDatabase"
import { LoginOutputDtO, SignupInputDTO, SignupOutputDTO } from "../dtos/userDTO"
import { BadRequestError } from "../error/BadRequestError"
import { NotFoundError } from "../error/NotFoundError"
import { User } from "../models/User"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { TokenPayload, UserDB, USER_ROLES } from "../types"


export class UserBusiness {
    constructor (
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) {}

    public userSignup = async(input:SignupInputDTO): Promise<SignupOutputDTO> => {
       const { name, email, password} = input

        if (typeof name !== "string") {
            throw new BadRequestError("'name' deve ser string")
        }

        if (typeof email !== "string") {
            throw new BadRequestError("'email' deve ser string")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser string")
        }
        
        const userDBExists = await this.userDatabase.findUserEmail(email)
        if (userDBExists) {
            
            throw new Error("'email' ja existe");
        }

        const id = this.idGenerator.generate()
        const hashePassword = await this.hashManager.hash(password)
        const role = USER_ROLES.USUARIO
        const createdAt = new Date().toISOString()
        
        const newUser = new User(
            id,
            name,
            email,
            hashePassword,
            role,
            createdAt
        )
        const newUserDB= newUser.toDBModel()
        await this.userDatabase.insertUser(newUserDB)

        const payload: TokenPayload = {
            id: newUser.getId(),
            name: newUser.getName(),
            role: newUser.getRole()
        }
        const token = this.tokenManager.createToken(payload)
        const output: SignupOutputDTO = {
            token
        }
        return output
    }

    public userLogin = async (input:any) =>{
        const {email, password} = input

        if (typeof email !== "string"){
            throw new BadRequestError("'email'deve ser uma string")
        }
        if(typeof password !== "string"){
            throw new BadRequestError("'password' deve ser string")
        }

        const searchUserDB:UserDB | undefined = await this.userDatabase.findUserEmail(email)
        
        if(!searchUserDB) {
            throw new NotFoundError("'email' não encontrado")
        }

        const user = new User  (
            searchUserDB.id,
            searchUserDB.name,
            searchUserDB.email,
            searchUserDB.password,
            searchUserDB.role,
            searchUserDB.created_at,
        )

        const hashePassword = user.getPassword()
        const correctPassword = await this.hashManager.compare(password, hashePassword)

        if(!correctPassword){
            throw new NotFoundError("'email' ou 'password' incorretos")
        }
        const payload: TokenPayload = {
            id: user.getId(),
            name: user.getName(),
            role: user.getRole()
        }
        const token = this.tokenManager.createToken(payload)
        const output: LoginOutputDtO = {
            token
        }
        return output
    }
}



