import { connection } from "../database/connection"

//Function to check whether the user already exists in the database
export const getUserById = async(user_id: string) => {
    const result = await connection.raw(`
        SELECT * FROM Labecommerce_users WHERE id = '${user_id}';
    `)

    return result[0]
}