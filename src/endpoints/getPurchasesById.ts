import { Request, Response } from "express"
import { connection } from "../database/connection"

//Function that returns all purchases from a user
const selectPurchases = async (user_id: string) => {
    const result = await connection.raw(`
        SELECT * FROM Labecommerce_purchases WHERE user_id = '${user_id}';
    `)

    return result[0]
}

//Function to check whether the user already exists in the database
const getUserById = async(user_id: string) => {
    const result = await connection.raw(`
        SELECT * FROM Labecommerce_users WHERE id = '${user_id}';
    `)

    return result[0]
}

//Endpoint
export const getPurchasesById = async (req: Request, res: Response) => {
    const user_id = req.params.user_id
    let errorCode = 400

    try {
        if (user_id === ':user_id') {
            errorCode = 422
            throw new Error("Provide user id.")
        }

        const userExists = await getUserById(user_id)

        if (userExists.length === 0) {
            errorCode = 404
            throw new Error("User does not exist.")
        }

        const result = await selectPurchases(user_id)
        res.status(200).send(result)

    } catch (err: any) {
        res.status(errorCode).send(err.message)
    }
}