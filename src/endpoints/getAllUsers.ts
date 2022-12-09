import { Request, Response } from "express"
import { connection } from "../database/connection"


//Function that returns all users
const selectAllUsers = async () => {
    let usersNewArray = []
    
    const users = await connection.raw(`
        SELECT * FROM Labecommerce_users;
    `)

    for (let i = 0; i < users[0].length; i++) {
        const purchases = await connection.raw(`
            SELECT Labecommerce_products.name, Labecommerce_products.price, Labecommerce_products.image_url,
            Labecommerce_purchases.quantity, Labecommerce_purchases.total_price
            FROM Labecommerce_purchases JOIN Labecommerce_products ON Labecommerce_products.id = Labecommerce_purchases.product_id
            AND Labecommerce_purchases.user_id LIKE '${users[0][i].id}';
        `)
        
        usersNewArray.push({...users[0][i], purchases: purchases[0]})
    }
    
    return usersNewArray
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