const express = require('express');
const multer = require('multer');
const { createTask, getTasks, completeTask, uploadFile, deleteTask } = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post('/', protect, admin, createTask);
router.get('/', protect, getTasks);
router.put('/:id/complete', protect, completeTask);
router.post('/:id/upload', protect, uploadFile);
router.delete('/:id', protect, admin, deleteTask);

module.exports = router;
