const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors()); 
app.use(express.json());

// MongoDB Atlas 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Atlas에 연결되었습니다.'))
  .catch((err) => console.error('MongoDB 연결 오류:', err));

// 1. Todo 스키마 정의 (startDate 필드 통합)
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  deadline: { type: Date },         // 마감일
  startDate: { type: Date, default: Date.now }, // ⭐ 시작일 추가 (기본값: 생성된 시점)
  isImportant: { type: Boolean, default: false },
});

const Todo = mongoose.model('Todo', todoSchema);

// [GET] 전체 조회
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Todos 조회 실패' });
  }
});

// [POST] 추가 (startDate를 함께 받도록 수정)
app.post('/api/todos', async (req, res) => {
  try {
    const { title, deadline, isImportant, startDate } = req.body; 
    const todo = new Todo({ 
      title, 
      deadline, 
      isImportant: isImportant || false,
      startDate: startDate || Date.now() // ⭐ 프론트에서 보낸 시작일 혹은 현재 시간 저장
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: 'Todo 추가 실패' });
  }
});

// [PUT] 수정 (모든 필드 업데이트 가능하도록 통합)
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // ⭐ 모든 필드를 한꺼번에 받아서 처리합니다.
    const { title, completed, deadline, isImportant, startDate } = req.body; 

    const todo = await Todo.findByIdAndUpdate(
      id,
      { title, completed, deadline, isImportant, startDate }, // ⭐ startDate 포함 업데이트
      { new: true }
    );

    if (!todo) return res.status(404).json({ error: 'Todo를 찾을 수 없습니다.' });
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: 'Todo 수정 실패' });
  }
});

// [DELETE] 삭제
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) return res.status(404).json({ error: 'Todo를 찾을 수 없습니다.' });
    res.json({ message: 'Todo가 삭제되었습니다.' });
  } catch (err) {
    res.status(400).json({ error: 'Todo 삭제 실패' });
  }
});

// 로컬 환경 실행 로직
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`로컬 서버 실행 중: http://localhost:${PORT}`);
  });
}

module.exports = app;