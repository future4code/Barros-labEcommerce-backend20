import { Request, Response } from "express"
import { connection } from "../database/connection"
import { getUserByEmail } from "../functions/getUserByEmail"
import { getUserById } from "../functions/getUserById"

//Function that updates user info
const updateInfo = async (id: string, email: string, password: string) => {
    await connection.raw(`
        UPDATE Labecommerce_users SET email = '${email}', password = '${password}'
        WHERE id = '${id}';
    `)
}

//Endpoint
export const editUserInfo = async (req: Request, res: Response) => {
    const id = req.params.id
    let {email, password} = req.body
    let errorCode = 400

    try {
        if (id === ':id') {
            errorCode = 422
            throw new Error("Provide user id.")
        }

        const userExists = await getUserById(id)

        if (userExists.length === 0) {
            errorCode = 404
            throw new Error("User does not exist.")
        }

        const emailExists = await getUserByEmail(email)
        if (emailExists.length > 0) {
            errorCode = 422
            throw new Error("This email is already registered.")
        }
        
        if (!email) {
            const result = await getUserById(id)
            email = result[0].email
        }
        
        if (!password) {
            const result = await getUserById(id)
            password = result[0].password
        }

        await updateInfo(id, email, password)
        res.status(201).send('Success! User information has been edited!')

    } catch (err: any) {
        res.status(errorCode).send(err.message)
    }
}