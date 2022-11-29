import { Request, Response } from "express"
import { connection } from "../database/connection"


//Function that returns all products
const selectAllProducts = async () => {
    const result = await connection.raw(`
        SELECT * FROM Labecommerce_products;
    `)

    return result[0]
}

//Endpoint
export const getAllProducts = async (req: Request, res: Response) => {
    let errorCode = 400
    
    try {
        const result = await selectAllProducts()
        res.status(200).send(result)

    } catch (err: any) {
        res.status(errorCode).send(err.message)
    }
}