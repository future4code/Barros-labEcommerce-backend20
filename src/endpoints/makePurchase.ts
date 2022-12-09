import { Request, Response } from "express"
import { connection } from "../database/connection"
import { getProductById } from "../functions/getProductById"
import { getUserById } from "../functions/getUserById"


//Function to insert values into the table
const insertPurchase = async (id: string, user_id: string, product_id: string, quantity: number, price: number) => {
    await connection.raw(`
        INSERT INTO Labecommerce_purchases
        VALUES('${id}', '${user_id}', '${product_id}', ${quantity}, ${price});
    `)
}

//Endpoint
export const makePurchase = async (req: Request, res: Response) => {
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

        const userExists = await getUserById(user_id)

        if (userExists.length === 0) {
            errorCode = 422
            throw new Error("User id does not exist.")
        }

        const productExists = await getProductById(product_id)

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