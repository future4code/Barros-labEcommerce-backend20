import { Request, Response } from "express"
import { connection } from "../database/connection"

//Function to know whether the user exists in the database
const selectUserId = async (user_id: string) => {
    const result = await connection.raw(`
        SELECT * FROM Labecommerce_users WHERE id = '${user_id}';
    `)

    return result[0]
}

//Function to know whether the product exists in the database
const selectProductId = async (product_id: string) => {
    const result = await connection.raw(`
        SELECT * FROM Labecommerce_products WHERE id = '${product_id}';
    `)

    return result[0]
}

//Function to insert values into the table
const insertPurchase = async (id: string, user_id: string, product_id: string, quantity: number, price: number) => {
    await connection.raw(`
        INSERT INTO Labecommerce_purchases
        VALUES('${id}', '${user_id}', '${product_id}', ${quantity}, ${price});
    `)
}

//Endpoint
export const purchaseRecord = async (req: Request, res: Response) => {
    const {user_id, product_id, quantity} = req.body
    let errorCode = 400

    try {
        if (!user_id && !product_id && !quantity) {
            errorCode = 422
            throw new Error("Provide the user id, the product id and the quantity.")
        } else if (!user_id) {
            errorCode = 422
            throw new Error("Provide the user id.")
        } else if (!product_id) {
            errorCode = 422
            throw new Error("Provide the product id.")
        } else if (!quantity) {
            errorCode = 422
            throw new Error("Provide the quantity.")
        } else if (Number(quantity) <= 0) {
            errorCode = 422
            throw new Error("Provide a quantity that is higher than zero.")
        }

        const userExists = await selectUserId(user_id)

        if (userExists.length === 0) {
            errorCode = 422
            throw new Error("User id does not exist.")
        }

        const productExists = await selectProductId(product_id)

        if (productExists.length === 0) {
            errorCode = 422
            throw new Error("Product id does not exist.")
        }

        const id = Date.now().toString()
        const totalPrice = Number(quantity) * Number(productExists[0].price)

        await insertPurchase(id, user_id, product_id, quantity, Number(totalPrice.toFixed(2)))
        res.status(201).send('Success! Purchase has been registered!')

    } catch (err: any) {
        res.status(errorCode).send(err.message)
    }

}