const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '../data/users.json');
const tasksPath = path.join(__dirname, '../data/tasks.json');

const readData = (filePath) => {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

const writeData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const mockDb = {
  users: {
    find: () => readData(usersPath),
    findOne: (query) => {
      const users = readData(usersPath);
      return users.find(u => Object.keys(query).every(k => u[k] === query[k]));
    },
    findById: (id) => {
      const users = readData(usersPath);
      return users.find(u => u._id === id);
    },
    save: (user) => {
      let users = readData(usersPath);
      const index = users.findIndex(u => u._id === user._id);
      if (index !== -1) {
        users[index] = user;
      } else {
        user._id = Date.now().toString();
        users.push(user);
      }
      writeData(usersPath, users);
      return user;
    },
    delete: (id) => {
      let users = readData(usersPath);
      users = users.filter(u => u._id !== id);
      writeData(usersPath, users);

      // Clean up tasks: remove user from assignedTo arrays
      let tasks = readData(tasksPath);
      tasks = tasks.map(t => {
        if (Array.isArray(t.assignedTo)) {
          t.assignedTo = t.assignedTo.filter(userId => userId !== id);
        } else if (t.assignedTo === id) {
          t.assignedTo = [];
        }
        return t;
      });
      writeData(tasksPath, tasks);
    }
  },
  tasks: {
    find: (query = {}) => {
      let tasks = readData(tasksPath);
      const users = readData(usersPath);
      
      // Filter
      if (Object.keys(query).length > 0) {
        tasks = tasks.filter(t => {
          return Object.keys(query).every(k => {
            if (k === 'assignedTo') {
              // Check if query.assignedTo is in the task's assignedTo array or matches if it's a single value
              const tAssigned = Array.isArray(t.assignedTo) ? t.assignedTo : [t.assignedTo];
              return tAssigned.includes(query[k].toString());
            }
            return t[k] && t[k].toString() === query[k].toString();
          });
        });
      }
      
      // Populate assignedTo (normalize to array)
      return tasks.map(t => {
        const assignedIds = Array.isArray(t.assignedTo) ? t.assignedTo : [t.assignedTo];
        return {
          ...t,
          assignedTo: assignedIds.map(id => users.find(u => u._id === id) || id)
        };
      });
    },
    findById: (id) => {
      const tasks = readData(tasksPath);
      return tasks.find(t => t._id === id);
    },
    create: (task) => {
      const tasks = readData(tasksPath);
      task._id = Date.now().toString();
      task.files = [];
      task.status = 'Pending';
      tasks.push(task);
      writeData(tasksPath, tasks);
      return task;
    },
    save: (task) => {
      const tasks = readData(tasksPath);
      const index = tasks.findIndex(t => t._id === task._id);
      if (index !== -1) tasks[index] = task;
      writeData(tasksPath, tasks);
      return task;
    },
    delete: (id) => {
      let tasks = readData(tasksPath);
      tasks = tasks.filter(t => t._id !== id);
      writeData(tasksPath, tasks);
    }
  }
};

module.exports = mockDb;
