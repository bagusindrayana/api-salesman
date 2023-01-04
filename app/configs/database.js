function mongo_uri() {
    return process.env.MONGODB_URI ?? "mongodb+srv://mydbroot:Ghcj8Q4ijEZE0TSI@cluster0.ffdoorx.mongodb.net/db_salesman?retryWrites=true&w=majority";
}

module.exports = {
    mongo_uri: mongo_uri
}