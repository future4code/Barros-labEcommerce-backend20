import { Request, Response } from "express"
import { connection } from "../database/connection"


//Function that returns all products without any sorting filter
const selectAllProducts = async () => {
    const result = await connection.raw(`
        SELECT * FROM Labecommerce_products;
    `)

    return result[0]
}

//Function that returns all products in order (asc or desc)
const selectAllProductsOrderedBy = async (order: string) => {
    const result = await connection.raw(`
        SELECT * FROM Labecommerce_products ORDER BY name ${order};
    `)

    return result[0]
}

//Function that returns products by the name
const searchProducts = async (search: string) => {
    const result = await connection.raw(`
        SELECT * FROM Labecommerce_products WHERE name LIKE '%${search}%';
    `)

    return result[0]
}

//Function that returns products by the name and in order
const searchProductsAndOrder = async (search: string, order: string) => {
    const result = await connection.raw(`
        SELECT * FROM Labecommerce_products WHERE name LIKE '%${search}%' ORDER BY name ${order};
    `)

    return result[0]
}

//Endpoint
export const getAllProducts = async (req: Request, res: Response) => {
    const {order, search} = req.query
    let errorCode = 400
    
    try {
        if (order) {
            if (order !== 'asc' && order !== 'desc') {
                errorCode = 422
                throw new Error("The order must be asc or desc.")
            } else if (!search) {
                const result = await selectAllProductsOrderedBy(order)
                res.status(200).send(result)
            } else if (search) {
                const result = await searchProductsAndOrder(search.toString(), order)
                if (result.length === 0) {
                    errorCode = 422
                    throw new Error("Product not found.")
                } else {
                    res.status(200).send(result)
                }
            }

        } else {
            if (!search) {
                const result = await selectAllProducts()
                res.status(200).send(result)
            } else if (search) {
                const result = await searchProducts(search.toString())
                if (result.length === 0) {
                    errorCode = 422
                    throw new Error("Product not found.")
                } else {
                    res.status(200).send(result)
                }
            }
        }

    } catch (err: any) {
        res.status(errorCode).send(err.message)
    }
}