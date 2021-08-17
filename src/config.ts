import dotenv from 'dotenv'
dotenv.config()

export default {
    prefix: '.',
    token: process.env.CLIENT_TOKEN,
    secret: process.env.CLIENT_SECRET,
    owner: '',
    server: {
        id: '',
        logs: ''
    },
    database: {
        uri: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@krowka.wqxzy.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
        params: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }
}
