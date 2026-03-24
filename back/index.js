const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware - 순서: CORS 먼저, JSON 해석 다음
app.use(cors()); 
app.use(express.json());

// MongoDB Atlas 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Atlas에 연결되었습니다.'))
  .catch((err) => console.error('MongoDB 연결 오류:', err));

// Todo 스키마 정의
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
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

// [POST] 추가
app.post('/api/todos', async (req, res) => {
  try {
    const { title } = req.body;
    const todo = new Todo({ title });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: 'Todo 추가 실패' });
  }
});

// ⭐ [PUT] 수정 (상태 변경 및 제목 수정 통합)
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body; // 👈 title을 받을 수 있도록 추가했습니다!

    const todo = await Todo.findByIdAndUpdate(
      id,
      { title, completed }, // 👈 title과 completed 중 들어오는 값을 모두 업데이트합니다.
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ error: 'Todo를 찾을 수 없습니다.' });
    }
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
    if (!todo) {
      return res.status(404).json({ error: 'Todo를 찾을 수 없습니다.' });
    }
    res.json({ message: 'Todo가 삭제되었습니다.' });
  } catch (err) {
    res.status(400).json({ error: 'Todo 삭제 실패' });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}번에서 실행 중입니다.`);
});