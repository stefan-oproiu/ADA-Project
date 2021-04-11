module.exports = {
ENV: process.env.NODE_ENV || 'development',
BANKING_SERVER_PORT: process.env.PORT || 3000,
BANKING_SERVER_URL: process.env.BASE_URL || 'http://localhost:3000',
MONGODB_CONNECTION_STRING: process.env.MONGODB_URI || 'mongodb+srv://vladimir:password1234@cluster0.zkjem.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
}