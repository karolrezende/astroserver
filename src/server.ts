import app from "./app"

const port = process.env.PORT ? Number(process.env.PORT) : 3001
app.listen(port,  ()=> {
        console.log("server inicialized, port:", port)
    }
)