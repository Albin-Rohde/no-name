module.exports = {
  "type": "postgres",
  "host": process.env.PGHOST,
  "port": process.env.PGPORT ? process.env.PGPORT : 5432,
  "username": process.env.PGUSER,
  "password": process.env.PGPASSWORD,
  "database": process.env.PGDATABASE,
  "synchronize": true,
  "logging": false,
  "entities": [
     "src/**/*.ts"
  ],
  "migrations": [
     "src/migration/**/*.ts"
  ],
  "subscribers": [
     "src/subscriber/**/*.ts"
  ]
}
