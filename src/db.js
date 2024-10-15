import Pool from "pg-pool";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "cinema",
  password: "duleGagic2510@",
  port: "5432",
});

export default pool;
