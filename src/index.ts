import { app } from "./app"
import { editProductInfo } from "./endpoints/editProductInfo"
import { editUserInfo } from "./endpoints/editUserInfo"
import { getAllProducts } from "./endpoints/getAllProducts"
import { getAllUsers } from "./endpoints/getAllUsers"
import { getPurchasesById } from "./endpoints/getPurchasesById"
import { makePurchase } from "./endpoints/makePurchase"
import { registerProduct } from "./endpoints/registerProduct"
import { createAccount } from "./endpoints/createAccount"


// Register user
app.post('/users', createAccount)

//Get All Users
app.get('/users', getAllUsers)

//Edit user info
app.put('/users/:id/account', editUserInfo)

//Get purchases by id
app.get('/users/:user_id/purchases', getPurchasesById)

//Get All Products
app.get('/products', getAllProducts)

//Make a purchase
app.post('/products', registerProduct)

//Edit product info
app.put('/products/:id', editProductInfo)

//Purchase Record
app.post('/purchases', makePurchase)