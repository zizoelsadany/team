const express = require('express');
const path = require('path');
const multer = require('multer');
const { createTask, getTasks, completeTask, uploadFile, deleteTask } = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post('/', protect, admin, createTask);
router.get('/', protect, getTasks);
router.put('/:id/complete', protect, completeTask);
router.post('/:id/upload', protect, upload.single('file'), uploadFile);
router.delete('/:id', protect, admin, deleteTask);

module.exports = router;
