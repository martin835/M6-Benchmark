import express from "express";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import productsRouter from "./products/index.js";
import usersRouter from "./users/index.js";
import shopCartRouter from "./shoppingCart/index.js";


const server = express();
const port = process.env.port || 5001;

//***********************************Middlewares*******************************************************/

server.use(cors());
server.use(express.json());

//***********************************Endpoints*********************************************************/

server.use("/products", productsRouter);
server.use("/users", usersRouter)
server.use("/shopCart", shopCartRouter);
//***********************************Error handlers****************************************************/

mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("👌 Connected to Mongo!");

  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`🚀 Server listening on port ${port}`);
  });
});
