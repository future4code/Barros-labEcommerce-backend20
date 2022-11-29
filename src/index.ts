import { app } from "./app"
import { getAllProducts } from "./endpoints/getAllProducts"
import { getAllUsers } from "./endpoints/getAllUsers"
import { getPurchasesById } from "./endpoints/getPurchasesById"
import { purchaseRecord } from "./endpoints/purchaseRecord"
import { registerProduct } from "./endpoints/registerProduct"
import { registerUser } from "./endpoints/registerUser"

// Register user
app.post('/users', registerUser)

//Get All Users
app.get('/users', getAllUsers)

//Register product
app.post('/products', registerProduct)

//Get All Products
app.get('/products', getAllProducts)

//Purchase Record
app.post('/purchases', purchaseRecord)

//Get purchases by id
app.get('/users/:user_id/purchases', getPurchasesById)