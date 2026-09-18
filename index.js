
import express from 'express'
import moment from 'moment';

moment().format();
const app = express()


app.use(express.json())

let products = [
    {
        id: 1,
        name: "banana",
        price: 100,
        category: "fruits"
    },
    {
        id: 2,
        name: "apple",
        price: 10,
        category: "fruits"
    },
    {
        id: 3,
        name: "carrot",
        price: 20,
        category: "vegetables"
    },
    {
        id: 4,
        name: "beef",
        price: 200,
        category: "meat"
    },
    {
        id: 5,
        name: "chop",
        price: 300,
        category: "meat"
    },
]

app.get('/timestamp', (req, res) => {
    res.json({
        "date": moment().format('YYYY-MM-DD')
    })
})
app.get('/health', (req, res) => {
    res.json({
        "status": "ok"
    })
})
app.get('/stats', (req, res) => {
    res.json({
        "uptime": process.uptime(),
        "nodeVersion": process.versions.node,
        "timestamp": moment().format('YYYY-MM-DD')
    })
})

app.get("/products", (req, res) => {
    // получаем категорию и колво продуктов
    const {take} = req.query
    const {category} = req.query
    // распаковка и создание копии
    let result = [...products]
    // если нет данных то все возвращаем
    if (!take && !category){
        return res.status(200).json(products)
    }
    // если есть тейк
    if(take){
        // проверяем что это чисдо и оно позитив
        const intTake = Number(take)
        if (!Number.isInteger((intTake)) || intTake <= 0){
            return res.status(400).json({
                message: "number had to be positive"
            })
        }
        // делам срез пролуктов
        result = products.slice(0, take)
    }
    // если еще и категоврия
    if (category){
        // ищем по категории
        result = result.filter((product) => {
            return product.category === category
        })
    }

    return res.status(200).json(result)
})
app.get("/products/:id", (req, res) => {
    const {id} = req.params
    const intId = Number(id)
    if (!Number.isInteger(intId) || intId <= 0){
        return res.status(400).json({
            message: "number had to be positive"
        })
    }
    const idFinded = products.find((product) => {
        return product.id === intId
    })
    if (!idFinded){return res.status(404).json({message: "Product not found"})}
    return res.status(200).json({
        idFinded
    })
})

async function addProduct(product, fail) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (fail === "true") {
                reject(new Error("Failed to save product"))
                return
            }
            products = [...products, product]
            resolve(product)
        }, 500)
    })
}

app.post("/products", async (req, res) => {
    const {fail} = req.query
    let {name, price, category, image} = req.body
    if (!name || !price || !category){
        return res.status(422).json({
            message: "One or more validation errors occurred."
        })
    }
    if (!image){
        image = ""
    }
    const intPrice = Number(price)
    if (!Number.isInteger(intPrice) || intPrice <= 0){
        return res.status(400).json({
            message: "price had to be positive"
        })
    }
    if (name.trim() === "" || category.trim() === ""){
        return res.status(422).json({
            message: "field is required"
        })
    }
    const isDouble = products.find((product) => {
        return product.name === name
    })
    if (isDouble){
        return res.status(409).json({
            message: "conflict of name"
        })
    }

    const result = await addProduct({name, price, category, image}, fail)
    return res.status(201).json(result)
})


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})

