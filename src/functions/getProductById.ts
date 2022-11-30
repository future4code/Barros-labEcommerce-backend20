import { connection } from "../database/connection"

//Function to know whether the product exists in the database
export const getProductById = async (product_id: string) => {
    const result = await connection.raw(`
        SELECT * FROM Labecommerce_products WHERE id = '${product_id}';
    `)

    return result[0]
}