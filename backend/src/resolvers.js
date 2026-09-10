import pool from './db.js';

export const resolvers = {
  Query: {
    items: async () => {
      const [rows] = await pool.query('SELECT * FROM items ORDER BY createdAt DESC');
      return rows.map(row => ({
        ...row,
        id: String(row.id),
        createdAt: row.createdAt ? row.createdAt.toISOString() : null,
        updatedAt: row.updatedAt ? row.updatedAt.toISOString() : null,
      }));
    },

    item: async (_, { id }) => {
      const [rows] = await pool.query('SELECT * FROM items WHERE id = ?', [id]);
      if (!rows[0]) return null;
      const row = rows[0];
      return {
        ...row,
        id: String(row.id),
        createdAt: row.createdAt ? row.createdAt.toISOString() : null,
        updatedAt: row.updatedAt ? row.updatedAt.toISOString() : null,
      };
    },
  },

  Mutation: {
    createItem: async (_, { name, text1, text2 }) => {
      const [result] = await pool.query(
        'INSERT INTO items (name, text1, text2) VALUES (?, ?, ?)',
        [name, text1 ?? null, text2 ?? null]
      );
      const [rows] = await pool.query('SELECT * FROM items WHERE id = ?', [result.insertId]);
      const row = rows[0];
      return {
        ...row,
        id: String(row.id),
        createdAt: row.createdAt ? row.createdAt.toISOString() : null,
        updatedAt: row.updatedAt ? row.updatedAt.toISOString() : null,
      };
    },

    updateItem: async (_, { id, name, text1, text2 }) => {
      const fields = [];
      const values = [];
      if (name !== undefined)  { fields.push('name = ?');  values.push(name); }
      if (text1 !== undefined) { fields.push('text1 = ?'); values.push(text1); }
      if (text2 !== undefined) { fields.push('text2 = ?'); values.push(text2); }
      if (!fields.length) throw new Error('No fields to update');
      values.push(id);
      await pool.query(`UPDATE items SET ${fields.join(', ')} WHERE id = ?`, values);
      const [rows] = await pool.query('SELECT * FROM items WHERE id = ?', [id]);
      const row = rows[0];
      return {
        ...row,
        id: String(row.id),
        createdAt: row.createdAt ? row.createdAt.toISOString() : null,
        updatedAt: row.updatedAt ? row.updatedAt.toISOString() : null,
      };
    },

    deleteItem: async (_, { id }) => {
      const [result] = await pool.query('DELETE FROM items WHERE id = ?', [id]);
      return result.affectedRows > 0;
    },
  },
};
