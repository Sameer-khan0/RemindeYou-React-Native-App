import * as SQLite from 'expo-sqlite';

let db = null;

export async function initDatabase() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('tasks.db');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE
      );
    `);
  }
}

// export async function fetchTasks() {
//   if (!db) throw new Error('Database not initialized');
//   const result = await db.getAllAsync('SELECT * FROM tasks');

//   return result.map(task => ({
//     ...task,
//     completed: !!task.completed,
//   }));
// }

// export async function addTask(title) {
//   if (!db) throw new Error('Database not initialized');
  
//   const result = await db.runAsync('INSERT INTO tasks (title) VALUES (?)', [title]);
//   return result.changes > 0;
// }

// export async function updateTask(id, newTitle) {
//   if (!db) throw new Error('Database not initialized');
  
//   const result = await db.runAsync('UPDATE tasks SET title = ? WHERE id = ?', [newTitle, id]);
//   return result.changes > 0;
// }

// export async function deleteTask(id) {
//   if (!db) throw new Error('Database not initialized');
  
//   const result = await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
//   return result.changes > 0;
// }

// export async function toggleTaskCompletion(id, completed) {
//   if (!db) throw new Error('Database not initialized');
  
//   const result = await db.runAsync(
//     'UPDATE tasks SET completed = ? WHERE id = ?',
//     [completed ? 1 : 0, id]
//   );
//   return result.changes > 0;
// }
