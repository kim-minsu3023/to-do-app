import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 백엔드 API 주소 (5001번 포트 확인!)
const API_URL = 'http://localhost:5001/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  
  // 수정 기능을 위한 상태
  const [editingId, setEditingId] = useState(null); 
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  // 실시간 남은 개수 계산 (렌더링될 때마다 자동 계산)
  const remainingCount = todos.filter((t) => !t.completed).length;

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('데이터 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post(API_URL, { title: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (err) {
      console.error('추가 실패:', err);
    }
  };

  const toggleComplete = async (todo) => {
    try {
      const response = await axios.put(`${API_URL}/${todo._id}`, {
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t._id === todo._id ? response.data : t)));
    } catch (err) {
      console.error('상태 변경 실패:', err);
    }
  };

  // ⭐ 제목 수정 저장 함수
  const saveEdit = async (id) => {
    if (!editText.trim()) {
      setEditingId(null);
      return;
    }
    try {
      const response = await axios.put(`${API_URL}/${id}`, { title: editText });
      setTodos(todos.map((t) => (t._id === id ? response.data : t)));
      setEditingId(null);
    } catch (err) {
      console.error('제목 수정 실패:', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.error('삭제 실패:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-200">
        <div className="text-2xl font-bold animate-pulse">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
            민수의 작업 게시판
          </h1>
          <p className="text-slate-400 text-lg">성공을 위한 첫걸음, 할 일 정리하기!</p>
        </header>

        <form onSubmit={addTodo} className="relative mb-10 p-6 bg-slate-900 rounded-3xl shadow-xl border border-slate-800 focus-within:border-indigo-500 transition-all">
          <div className="relative">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="무엇을 해야 할까요?"
              className="w-full px-5 py-3.5 bg-slate-800 rounded-xl text-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-700"
            />
            <button
              type="submit"
              className="absolute right-2.5 top-2.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium text-white transition duration-200 ease-in-out"
            >
              + 추가
            </button>
          </div>
        </form>

        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h2 className="text-2xl font-semibold">내 업무</h2>
            <span className="px-3 py-1 bg-slate-800 rounded-full text-slate-400 text-sm">
              {remainingCount}개 남음
            </span>
          </div>

          {todos.length === 0 && (
            <div className="text-center py-20 text-slate-600 text-xl">
              할 일이 없습니다. 새로운 작업을 추가해 보세요!
            </div>
          )}

          {todos.map((todo) => (
            <div key={todo._id} className="group flex items-center justify-between gap-4 p-5 bg-slate-900 rounded-2xl border border-slate-800/50 hover:border-slate-700 transition duration-150">
              <div className="flex items-center gap-4 flex-1">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo)}
                  className="appearance-none h-6 w-6 border-2 border-slate-700 rounded-full checked:bg-indigo-600 checked:border-transparent transition cursor-pointer"
                />
                
                {/* 수정 모드 조건부 렌더링 */}
                {editingId === todo._id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => saveEdit(todo._id)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(todo._id)}
                    className="flex-1 bg-slate-800 border border-indigo-500 rounded-lg px-3 py-1 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                ) : (
                  <span 
                    className={`flex-1 text-lg group-hover:text-white transition cursor-pointer ${todo.completed ? 'line-through text-slate-600' : 'text-slate-200'}`}
                    onClick={() => toggleComplete(todo)}
                    onDoubleClick={() => {
                      setEditingId(todo._id);
                      setEditText(todo.title);
                    }}
                  >
                    {todo.title}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* 수정 버튼 (연필 아이콘) */}
                <button
                  onClick={() => {
                    setEditingId(todo._id);
                    setEditText(todo.title);
                  }}
                  className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-indigo-400 transition"
                  title="수정하기"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </button>

                {/* 삭제 버튼 (휴지통 아이콘) */}
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="p-2.5 bg-slate-800 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-950/20 transition duration-150"
                  title="삭제하기"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;