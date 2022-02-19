module.exports = {
  "type": "postgres",
  "host": process.env.POSTGRES_HOST,
  "port": process.env.POSTGRES_PORT || 5432,
  "username": process.env.POSTGRES_USER,
  "password": process.env.POSTGRES_PASSWORD,
  "database": process.env.POSTGRES_DB,
  "synchronize": false,
  "logging": false,
  "entities": [
    process.env.TYPEORM_ENTITIES,
  ],
  "migrations": [
    process.env.TYPEORM_MIGRATIONS,
  ],
  "subscribers": [
    "build/src/subscriber/**/*.js"
  ],
  "cli": {
    "migrationsDir": process.env.TYPEORM_MIGRATIONS_OUT,
  }
}
