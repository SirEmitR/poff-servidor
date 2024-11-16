import mariadb from 'mariadb';
process.loadEnvFile();

const pool = mariadb.createPool({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

class Database {
    async query(query, params) {
        let conn;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query(query, params);
            return rows;
        } catch (err) {
            throw err;
        } finally {
            if (conn) conn.end();
        }
    }
}

export default new Database();