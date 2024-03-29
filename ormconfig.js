module.exports = {
    "type": "postgres",
    "host": process.env.DB_HOST,
    "port": +process.env.DB_PORT,
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DB,
    "entities": ["dist/**/*.entity{.ts,.js}"],
    "synchronize": true
}