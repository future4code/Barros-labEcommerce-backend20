import { connection } from "../database/connection"

//Function to check whether the email already exists in the database
export const getUserByEmail = async(email: string) => {
    const result = await connection.raw(`
        SELECT * FROM Labecommerce_users WHERE email = '${email}';
    `)

    return result[0]
}