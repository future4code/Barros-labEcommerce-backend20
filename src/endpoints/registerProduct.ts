import { Request, Response } from "express"
import { connection } from "../database/connection"

//Function that registers a product
const postProduct = async (id: string, name: string, price: number, image_url: string) => {
    await connection.raw(`
        INSERT INTO Labecommerce_products
        VALUES ('${id}', '${name}', ${price}, '${image_url}');
    `)
}

//Endpoint
export const registerProduct = async (req: Request, res: Response) => {
    const {name, price, image_url} = req.body
    let errorCode = 400

    try {
        if (!name && !price && !image_url) {
            errorCode = 422
            throw new Error("Provide the product name, price and image url.")
        } else if (!name) {
            errorCode = 422
            throw new Error("Provide the product name.")
        } else if (!price) {
            errorCode = 422
            throw new Error("Provide the price.")
        } else if (!image_url) {
            errorCode = 422
            throw new Error("Provide the image url.")
        } else if (Number(price) <= 0) {
            errorCode = 422
            throw new Error("Provide a valid price.")
        }

        await postProduct(Date.now().toString(), name, price, image_url)
        res.status(201).send('Success! The product has been registerd!')

    } catch (err: any) {
        res.status(errorCode).send(err.message)
    }
}