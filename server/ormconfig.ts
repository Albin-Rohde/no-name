module.exports = {
  "type": "postgres",
  "host": process.env.PGHOST,
  "port": process.env.PGPORT ? process.env.PGPORT : 5432,
  "username": process.env.PGUSER,
  "password": process.env.PGPASSWORD,
  "database": process.env.PGDATABASE,
  "synchronize": false,
  "logging": false,
  "entities": [
    "build/src/db/**/models/*.js"
  ],
  "migrations": [
    "build/src/db/migrations/*.js"
  ],
  "subscribers": [
    "build/src/subscriber/**/*.js"
  ]
}
