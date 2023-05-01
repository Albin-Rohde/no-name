module.exports = {
  "type": "postgres",
  "host": process.env.POSTGRES_HOST || 'localhost',
  "port": process.env.POSTGRES_PORT || 5432,
  "username": process.env.POSTGRES_USER || 'user',
  "password": process.env.POSTGRES_PASSWORD,
  "database": process.env.POSTGRES_DB || 'no_name_db',
  "synchronize": false,
  "logging": process.env.DEBUG,
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
