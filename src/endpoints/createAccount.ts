import { Request, Response } from "express"
import { connection } from "../database/connection"
import { getUserByEmail } from "../functions/getUserByEmail"

//Function to register the user
const postUser = async (id: string, name: string, email: string, password: string) => {
    await connection.raw(`
        INSERT INTO Labecommerce_users
        VALUES ('${id}', '${name}', '${email}', '${password}');
    `)
}

//Endpoint
export const createAccount = async (req: Request, res: Response) => {
    const {name, email, password} = req.body
    let errorCode = 400

    try {
        if (!name && !email && !password) {
            errorCode = 422
            throw new Error("Provide user name, email and password.")
        } else if (!name) {
            errorCode = 422
            throw new Error("Provide user name.")
        } else if (!email) {
            errorCode = 422
            throw new Error("Provide the email.")
        } else if (!password) {
            errorCode = 422
            throw new Error("Provide the password.")
        }

        const userExists = await getUserByEmail(email)
        
        if (userExists.length > 0) {
            errorCode = 422
            throw new Error("User already registered.")
        }

        await postUser(Date.now().toString(), name, email, password)
        res.status(201).send('Success! User has been registered!')

    } catch (err: any) {
        res.status(errorCode).send(err.message)
    }
}