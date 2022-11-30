import { Request, Response } from "express"
import { connection } from "../database/connection"
import { getProductById } from "../functions/getProductById"


//Function that updates product info
const updateInfo = async (id: string, name: string, price: number, image_url: string) => {
    await connection.raw(`
        UPDATE Labecommerce_products SET name = '${name}', price = ${price}, image_url = '${image_url}'
        WHERE id = '${id}';
    `)
}

//Endpoint
export const editProductInfo = async (req: Request, res: Response) => {
    const id = req.params.id
    let {name, price, image_url} = req.body
    let errorCode = 400

    try {
        if (id === ':id') {
            errorCode = 422
            throw new Error("Provide product id.")
        }

        const productExists = await getProductById(id)

        if (productExists.length === 0) {
            errorCode = 404
            throw new Error("Product not found.")
        }
        
        if (!name) {
            const result = await getProductById(id)
            name = result[0].name
        }
        
        if (!price) {
            const result = await getProductById(id)
            price = result[0].price
        }

        if (!image_url) {
            const result = await getProductById(id)
            image_url = result[0].image_url
        }

        await updateInfo(id, name, price, image_url)
        res.status(201).send('Success! Product information has been edited!')

    } catch (err: any) {
        res.status(errorCode).send(err.message)
    }
}