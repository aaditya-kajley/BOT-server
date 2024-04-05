const express = require('express')
const mongo = require('mongo')
const cors = require('cors')
const collection = require('./mongo')
const app = express()
const dotenv = require("dotenv")
const session = require("express-session")
const bcrypt = require('bcryptjs')
const OpenAI = require('openai');

dotenv.config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());

app.use(session({
    secret: 'Top level secret',
    resave: false,
    saveUninitialized: true
}))

app.get('/', cors(), (req, res) => {

})

app.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        if(session.user){
            session.user = null;
        }
        const user = await collection.findOne({ email: email })

        if (await bcrypt.compareSync(req.body.password, user.password)) {
            session.user = email
            console.log(session.user)
            res.json("exist")

        }
        else {
            res.json("notexist")
        }
    }
    catch (e) {
        res.json("notexist")
    }
})

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body

    console.log("rtg")
    try {
        const check = await collection.findOne({ email: email })

        if (check) {
            res.json("exist")
        }
        else {
            const salt = await bcrypt.genSalt(10)
            const passHash = await bcrypt.hash(password, salt)
            const data = {
                name: name,
                email: email,
                password: passHash
            }
            await collection.insertMany([data])
            session.user = email
            res.json("notexist")
        }
    }
    catch (e) {
        res.json("notexist")
    }
})


app.post('/chatbot', async (req, res) => {
    if (session.user == null) {
        res.json("LogIn")
    }
    else {
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API);
        const input = req.body.text
        async function run() {
            // For text-only input, use the gemini-pro model
            const model = await genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = input
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            console.log(text);
            res.json(text);
        }
        run();
    }
})

app.post('/imagegeneration', async (req, res) => {

    console.log(session.user)
    if (session.user == null) {
        res.json("LogIn")
    }
    else {
        const openai = new OpenAI({
            apiKey: "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"
        });

        const prompt = req.body.prompt;
        const numberOfImages = 1;
        const imageSize = "1024x1024";
        async function run() {
            const imageGenaration = openai.images.generate(
                {
                    prompt: prompt,
                    n: numberOfImages,
                    size: imageSize

                }).then((data) => {
                    console.log(data);
                    res.json(data)
                });
        }
        run();
    }
})

app.listen(8000, () => {
    console.log("Port Connected")
})