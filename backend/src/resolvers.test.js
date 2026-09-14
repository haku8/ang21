import { resolvers } from './resolvers.js';

// Mock the database pool
const mockPool = {
  query: jest.fn(),
};

jest.mock('./db.js', () => mockPool);

describe('Resolvers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Query.items', () => {
    it('should return all items ordered by createdAt DESC', async () => {
      const mockRows = [
        {
          id: 2,
          name: 'Item 2',
          text1: 'Text 1',
          text2: 'Text 2',
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-02'),
        },
        {
          id: 1,
          name: 'Item 1',
          text1: null,
          text2: null,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ];
      mockPool.query.mockResolvedValue([mockRows]);

      const result = await resolvers.Query.items();

      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM items ORDER BY createdAt DESC');
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('2');
      expect(result[0].name).toBe('Item 2');
      expect(result[1].id).toBe('1');
      expect(result[1].name).toBe('Item 1');
    });

    it('should handle null createdAt and updatedAt', async () => {
      const mockRows = [
        {
          id: 1,
          name: 'Item 1',
          text1: null,
          text2: null,
          createdAt: null,
          updatedAt: null,
        },
      ];
      mockPool.query.mockResolvedValue([mockRows]);

      const result = await resolvers.Query.items();

      expect(result[0].createdAt).toBeNull();
      expect(result[0].updatedAt).toBeNull();
    });
  });

  describe('Query.item', () => {
    it('should return a single item by id', async () => {
      const mockRows = [
        {
          id: 1,
          name: 'Item 1',
          text1: 'Text 1',
          text2: 'Text 2',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ];
      mockPool.query.mockResolvedValue([mockRows]);

      const result = await resolvers.Query.item(null, { id: '1' });

      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM items WHERE id = ?', ['1']);
      expect(result).not.toBeNull();
      expect(result.id).toBe('1');
      expect(result.name).toBe('Item 1');
    });

    it('should return null if item not found', async () => {
      mockPool.query.mockResolvedValue([[]]);

      const result = await resolvers.Query.item(null, { id: '999' });

      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM items WHERE id = ?', ['999']);
      expect(result).toBeNull();
    });
  });

  describe('Mutation.createItem', () => {
    it('should create a new item', async () => {
      const mockInsertResult = { insertId: 1 };
      const mockRows = [
        {
          id: 1,
          name: 'New Item',
          text1: 'Text 1',
          text2: 'Text 2',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ];
      mockPool.query
        .mockResolvedValueOnce([mockInsertResult])
        .mockResolvedValueOnce([mockRows]);

      const result = await resolvers.Mutation.createItem(null, {
        name: 'New Item',
        text1: 'Text 1',
        text2: 'Text 2',
      });

      expect(mockPool.query).toHaveBeenCalledTimes(2);
      expect(mockPool.query).toHaveBeenNthCalledWith(
        1,
        'INSERT INTO items (name, text1, text2) VALUES (?, ?, ?)',
        ['New Item', 'Text 1', 'Text 2']
      );
      expect(mockPool.query).toHaveBeenNthCalledWith(
        2,
        'SELECT * FROM items WHERE id = ?',
        [1]
      );
      expect(result.id).toBe('1');
      expect(result.name).toBe('New Item');
    });

    it('should create item with null text fields', async () => {
      const mockInsertResult = { insertId: 1 };
      const mockRows = [
        {
          id: 1,
          name: 'New Item',
          text1: null,
          text2: null,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ];
      mockPool.query
        .mockResolvedValueOnce([mockInsertResult])
        .mockResolvedValueOnce([mockRows]);

      const result = await resolvers.Mutation.createItem(null, {
        name: 'New Item',
        text1: null,
        text2: null,
      });

      expect(mockPool.query).toHaveBeenNthCalledWith(
        1,
        'INSERT INTO items (name, text1, text2) VALUES (?, ?, ?)',
        ['New Item', null, null]
      );
      expect(result.text1).toBeNull();
      expect(result.text2).toBeNull();
    });
  });

  describe('Mutation.updateItem', () => {
    it('should update an item with all fields', async () => {
      const mockRows = [
        {
          id: 1,
          name: 'Updated Item',
          text1: 'Updated Text 1',
          text2: 'Updated Text 2',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        },
      ];
      mockPool.query.mockResolvedValue([mockRows]);

      const result = await resolvers.Mutation.updateItem(null, {
        id: '1',
        name: 'Updated Item',
        text1: 'Updated Text 1',
        text2: 'Updated Text 2',
      });

      expect(mockPool.query).toHaveBeenCalledTimes(2);
      expect(mockPool.query).toHaveBeenNthCalledWith(
        1,
        'UPDATE items SET name = ?, text1 = ?, text2 = ? WHERE id = ?',
        ['Updated Item', 'Updated Text 1', 'Updated Text 2', '1']
      );
      expect(result.name).toBe('Updated Item');
    });

    it('should update only provided fields', async () => {
      const mockRows = [
        {
          id: 1,
          name: 'Updated Name',
          text1: 'Original Text 1',
          text2: 'Original Text 2',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        },
      ];
      mockPool.query.mockResolvedValue([mockRows]);

      const result = await resolvers.Mutation.updateItem(null, {
        id: '1',
        name: 'Updated Name',
      });

      expect(mockPool.query).toHaveBeenNthCalledWith(
        1,
        'UPDATE items SET name = ? WHERE id = ?',
        ['Updated Name', '1']
      );
      expect(result.name).toBe('Updated Name');
    });

    it('should throw error if no fields to update', async () => {
      await expect(
        resolvers.Mutation.updateItem(null, { id: '1' })
      ).rejects.toThrow('No fields to update');
    });
  });

  describe('Mutation.deleteItem', () => {
    it('should delete an item and return true', async () => {
      const mockResult = { affectedRows: 1 };
      mockPool.query.mockResolvedValue([mockResult]);

      const result = await resolvers.Mutation.deleteItem(null, { id: '1' });

      expect(mockPool.query).toHaveBeenCalledWith('DELETE FROM items WHERE id = ?', ['1']);
      expect(result).toBe(true);
    });

    it('should return false if item not found', async () => {
      const mockResult = { affectedRows: 0 };
      mockPool.query.mockResolvedValue([mockResult]);

      const result = await resolvers.Mutation.deleteItem(null, { id: '999' });

      expect(mockPool.query).toHaveBeenCalledWith('DELETE FROM items WHERE id = ?', ['999']);
      expect(result).toBe(false);
    });
  });
});
