import { View, Text, Button, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";

let db: any = null;

const initDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("app.db");
    console.log("Database opened");

    try {
      // Create 'users' table
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE
        );
      `);
      console.log("Users table ensured.");

      // Create 'notes' table with foreign key to 'users'
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT,
          user_id INTEGER,
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
      `);
      console.log("Notes table ensured.");
    } catch (error) {
      console.error("Error creating tables:", error);
    }
  }
};

const createUser = async (name: string, email: string) => {
  if (!db) throw new Error("Database not initialized");
  try {
    const result = await db.runAsync(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    );
    if (result.changes > 0) {
      console.log("User created successfully");
    } else {
      console.log("No user was created");
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

const fetchUsers = async () => {
  if (!db) throw new Error("Database not initialized");

  try {
    const result = await db.getAllAsync(`SELECT * FROM users`);
    console.log(result);
  } catch (error) {
    console.log("Error fetching users:", error);
  }
};

const updateNotes = async (
  id: number,
  title: string,
  content: string,
  user_id: number
) => {
  if (!db) throw new Error("Database not initialized");

  try {
    const result = await db.runAsync(
      "UPDATE notes SET title = ?, content = ?, user_id = ? WHERE id = ?",
      [title, content, user_id, id]
    );
    if (result.changes > 0) {
      console.log("Note created successfully");
    } else {
      console.log("No Note was created");
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

const creatNotes = async (title: string, content: string, user_id: Number) => {
  if (!db) throw new Error("Database not initialized");
  try {
    const result = await db.runAsync(
      "INSERT INTO notes (title, content, user_id ) VALUES (?, ?, ?)",
      [title, content, user_id]
    );
    if (result.changes > 0) {
      console.log("Note created successfully");
    } else {
      console.log("No Note was created");
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

const DeleteNote = async (user_id: number, note_id: number) => {
  if (!db) throw new Error("Database not initialized");
  try {
    const result = await db.runAsync(
      `DELETE FROM notes WHERE user_id = ? AND id = ?`,
      [user_id, note_id]
    );

    if (result.changes > 0) {
      console.log("Note deleted successfully");
    } else {
      console.log("No note was deleted (maybe wrong user_id or note_id)");
    }
  } catch (error) {
    console.log("Error deleting note:", error);
  }
};

export default function Sql() {
  const [notes, setnotes] = useState([]);

  const fetchNotes = async (user_id: number) => {
    if (!db) throw new Error("Database not initialized");

    try {
      const result = await db.getAllAsync(
        ` SELECT 
          notes.id as note_id,
          notes.title as note_title,
          notes.content,
          users.id as user_id,
          users.name as user_name,
          users.email
        FROM notes
        INNER JOIN users ON notes.user_id = ?`,
        [user_id]
      );
      console.log("Fetched notes:", result);
      setnotes(result);
    } catch (error) {
      console.log("Error fetching user notes:", error);
    }
  };
useEffect(() => {
  const initializeDatabase = async () => {
    await initDatabase(); 
    fetchNotes(1);  // Then, fetch notes for user with ID 1
  };

  initializeDatabase(); // Call the async function to initialize the database and fetch notes
}, [])

  return (
    <View>
      <Button
        title="Create User"
        onPress={() => createUser("ali", "ali@gmail.com")}
      />
      <Button title="fetch users NOtes" onPress={() => fetchNotes(1)} />
      <Button title="fetch users" onPress={() => fetchUsers()} />
      <Button title="Delete Note" onPress={() => DeleteNote(1, 3)} />
      <Button
        title="Create Note"
        onPress={() => creatNotes("Exam", "Prepare a book for 2 hours", 1)}
      />
      <Button
        title="Update Note"
        onPress={() =>
          updateNotes(1, "entertainmant", "watch a movie for two hours", 1)
        }
      />
      <FlatList
        data={notes}
        keyExtractor={(item) => item.note_id.toString()} // Ensure that the key is a string
        renderItem={({ item }) => {
          // Destructure to access item
          return (
            <>
              <Text>{item.note_title}</Text>
              <Text>{item.content}</Text>
            </>
          );
        }}
      />
    </View>
  );
}
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   FlatList,
//   Modal,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
//   Keyboard
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import Icon from "react-native-vector-icons/Ionicons";
// import {
//   initDatabase,
//   fetchTasks,
//   addTask,
//   updateTask,
//   deleteTask,
//   toggleTaskCompletion
// } from "../Database/db";

// type Task = {
//   id: number;
//   title: string;
//   completed: boolean;
// };

// const TaskManager: React.FC = () => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [text, setText] = useState<string>("");
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [editTaskId, setEditTaskId] = useState<number | null>(null);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   useEffect(() => {
//     loadTasks();
//   }, []);

//   const loadTasks = async () => {
//     setIsRefreshing(true);
//     try {
//       await initDatabase();
//       const loadedTasks = await fetchTasks();
//       setTasks(loadedTasks);
//     } catch (error) {
//       console.error("Failed to load tasks:", error);
//       Alert.alert("Error", "Failed to load tasks");
//     } finally {
//       setIsRefreshing(false);
//     }
//   };

//   const handleSubmit = async () => {
//     if (text.trim().length === 0) return;

//     try {
//       if (editTaskId !== null) {
//         const success = await updateTask(editTaskId, text);
//         if (success) {
//           setTasks(prev => prev.map(task =>
//             task.id === editTaskId ? { ...task, title: text } : task
//           ));
//         }
//       } else {
//         const success = await addTask(text);
//         if (success) {
//           loadTasks(); // Refresh the list to get the new ID
//         }
//       }

//       setText("");
//       setEditTaskId(null);
//       setIsModalVisible(false);
//     } catch (error) {
//       console.error("Failed to save task:", error);
//       Alert.alert("Error", "Failed to save task");
//     }
//   };

//   const handleEdit = (task: Task) => {
//     setEditTaskId(task.id);
//     setText(task.title);
//     setIsModalVisible(true);
//   };

//   const handleDelete = async (id: number) => {
//     Alert.alert(
//       "Delete Task",
//       "Are you sure you want to delete this task?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: async () => {
//             const success = await deleteTask(id);
//             if (success) {
//               setTasks(prev => prev.filter(task => task.id !== id));
//             }
//           }
//         }
//       ]
//     );
//   };

//   const handleToggleCompletion = async (id: number, completed: boolean) => {
//     const success = await toggleTaskCompletion(id, !completed);
//     if (success) {
//       setTasks(prev => prev.map(task =>
//         task.id === id ? { ...task, completed: !completed } : task
//       ));
//     }
//   };

//   const renderTask = ({ item }: { item: Task }) => (
//     <View style={[
//       styles.taskItem,
//       item.completed && styles.completedTask
//     ]}>
//       <TouchableOpacity
//         style={styles.checkboxContainer}
//         onPress={() => handleToggleCompletion(item.id, item.completed)}
//       >
//         <Icon
//           name={item.completed ? "checkbox-outline" : "square-outline"}
//           size={24}
//           color={item.completed ? "#4CAF50" : "#757575"}
//         />
//       </TouchableOpacity>

//       <Text style={[
//         styles.taskTitle,
//         item.completed && styles.completedText
//       ]}>
//         {item.title}
//       </Text>

//       <View style={styles.icons}>
//         <TouchableOpacity onPress={() => handleEdit(item)}>
//           <Icon name="pencil" size={20} color="#2196F3" style={styles.icon} />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => handleDelete(item.id)}>
//           <Icon name="trash" size={20} color="#F44336" style={styles.icon} />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//     >
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <View style={styles.innerContainer}>
//           <View style={styles.header}>
//             <Text style={styles.headerText}>My Tasks</Text>
//             <TouchableOpacity
//               style={styles.addButton}
//               onPress={() => setIsModalVisible(true)}
//             >
//               <Icon name="add" size={24} color="white" />
//             </TouchableOpacity>
//           </View>

//           <FlatList
//             data={tasks}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={renderTask}
//             refreshing={isRefreshing}
//             onRefresh={loadTasks}
//             ListEmptyComponent={
//               <View style={styles.emptyState}>
//                 <Icon name="list" size={50} color="#E0E0E0" />
//                 <Text style={styles.emptyText}>No tasks yet</Text>
//                 <Text style={styles.emptySubtext}>Add a task to get started</Text>
//               </View>
//             }
//           />

//           <Modal
//             visible={isModalVisible}
//             transparent
//             animationType="fade"
//             onRequestClose={() => {
//               setIsModalVisible(false);
//               setText('');
//               setEditTaskId(null);
//             }}
//           >
//             <View style={styles.modalOverlay}>
//               <TouchableWithoutFeedback onPress={() => {
//                 setIsModalVisible(false);
//                 setText('');
//                 setEditTaskId(null);
//               }}>
//                 <View style={styles.modalBackdrop} />
//               </TouchableWithoutFeedback>

//               <View style={styles.modalContent}>
//                 <Text style={styles.modalTitle}>
//                   {editTaskId !== null ? "Edit Task" : "Add New Task"}
//                 </Text>

//                 <TextInput
//                   value={text}
//                   onChangeText={setText}
//                   placeholder="Enter task..."
//                   style={styles.input}
//                   autoFocus
//                   onSubmitEditing={handleSubmit}
//                 />

//                 <View style={styles.modalButtons}>
//                   <TouchableOpacity
//                     style={styles.cancelButton}
//                     onPress={() => {
//                       setIsModalVisible(false);
//                       setText('');
//                       setEditTaskId(null);
//                     }}
//                   >
//                     <Text style={styles.cancelButtonText}>Cancel</Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     style={styles.submitButton}
//                     onPress={handleSubmit}
//                     disabled={text.trim().length === 0}
//                   >
//                     <Text style={styles.submitButtonText}>
//                       {editTaskId !== null ? "Update" : "Add"}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           </Modal>
//         </View>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   innerContainer: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingTop: Platform.OS === 'ios' ? 50 : 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   headerText: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   addButton: {
//     backgroundColor: '#2196F3',
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 2,
//   },
//   taskItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 10,
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 1,
//   },
//   completedTask: {
//     opacity: 0.7,
//   },
//   checkboxContainer: {
//     marginRight: 12,
//   },
//   taskTitle: {
//     flex: 1,
//     fontSize: 16,
//     color: '#333',
//   },
//   completedText: {
//     textDecorationLine: 'line-through',
//     color: '#9E9E9E',
//   },
//   icons: {
//     flexDirection: 'row',
//     marginLeft: 10,
//   },
//   icon: {
//     marginLeft: 15,
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 50,
//   },
//   emptyText: {
//     fontSize: 18,
//     color: '#9E9E9E',
//     marginTop: 16,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: '#BDBDBD',
//     marginTop: 4,
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalBackdrop: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   modalContent: {
//     width: '85%',
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 20,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#333',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     marginBottom: 20,
//     backgroundColor: '#FAFAFA',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//   },
//   cancelButton: {
//     padding: 10,
//     marginRight: 10,
//   },
//   cancelButtonText: {
//     color: '#757575',
//     fontSize: 16,
//   },
//   submitButton: {
//     backgroundColor: '#2196F3',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   submitButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '500',
//   },
// });

// export default TaskManager;
