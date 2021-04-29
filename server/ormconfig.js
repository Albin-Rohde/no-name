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
     "src/db/**/models/*.ts"
  ],
  "migrations": [
     "src/db/migrations/*.ts"
  ],
  "subscribers": [
     "src/subscriber/**/*.ts"
  ]
}
