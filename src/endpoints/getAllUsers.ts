import { Request, Response } from "express"
import { connection } from "../database/connection"


//Functions that returns all users
const selectAllUsers = async () => {
    const result = await connection.raw(`
        SELECT * FROM Labecommerce_users;
    `)

    return result[0]
}

//Endpoint
export const getAllUsers = async (req: Request, res: Response) => {
    let errorCode = 400

    try {
        const result = await selectAllUsers()
        res.status(200).send(result)

    } catch (err: any) {
        res.status(errorCode).send(err.message)
    }
}