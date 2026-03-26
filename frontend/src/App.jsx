// ⭐ 예시 1: App.jsx (Cyberpunk 스타일)
// 통째로 복사해서 붙여넣으세요.
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = '/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [editingId, setEditingId] = useState(null); 
  const [editText, setEditText] = useState('');
  const [editDeadline, setEditDeadline] = useState('');

  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    fetchTodos();
  }, []);

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const setMidnight = (checked) => {
    if (checked) {
      const target = new Date(selectedDate);
      target.setHours(23, 59, 59, 999);
      const offset = target.getTimezoneOffset() * 60000;
      setDeadline(new Date(target - offset).toISOString().slice(0, 16));
    } else {
      setDeadline('');
    }
  };

  const filteredTodos = todos.filter(todo => {
    const viewDate = new Date(selectedDate);
    viewDate.setHours(0, 0, 0, 0);
    const start = new Date(todo.startDate || todo.createdAt);
    start.setHours(0, 0, 0, 0);
    if (!todo.deadline) return viewDate >= start;
    const end = new Date(todo.deadline);
    end.setHours(23, 59, 59, 999);
    return viewDate >= start && viewDate <= end;
  });

  const completedToday = filteredTodos.filter(t => t.completed).length;
  const failedToday = filteredTodos.filter(t => !t.completed && t.deadline && new Date(t.deadline) < currentTime).length;
  const totalFinished = completedToday + failedToday;
  const winRate = totalFinished > 0 ? Math.round((completedToday / totalFinished) * 100) : 100;

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (!a.completed && a.isImportant !== b.isImportant) return a.isImportant ? -1 : 1;
    if (a.deadline && b.deadline) return new Date(a.deadline) - new Date(b.deadline);
    return 0;
  });

  const getUrgencyStyle = (todo) => {
    if (todo.completed) return 'bg-slate-900/40 opacity-50 border-transparent';
    if (!todo.deadline) return 'bg-slate-900 border-slate-800';
    const diffInMin = (new Date(todo.deadline) - currentTime) / (1000 * 60);
    if (diffInMin < 0) return 'bg-red-950/20 border-red-500 shadow-[0_0_20px_#ef4444] border-dashed border-2'; 
    if (diffInMin <= 60) return 'bg-pink-950/20 border-pink-500 shadow-[0_0_20px_#ec4899] animate-pulse border-2'; 
    return 'bg-cyan-500/5 border-cyan-500/30 border-2 shadow-[0_0_10px_#22d3ee]'; 
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(Array.isArray(response.data) ? response.data : []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post(API_URL, { 
        title: newTodo, deadline, startDate: selectedDate 
      });
      setTodos([...todos, response.data]);
      setNewTodo(''); setNewDeadline('');
    } catch (err) { console.error(err); }
  };

  const toggleComplete = async (todo) => {
    try {
      const response = await axios.put(`${API_URL}/${todo._id}`, { completed: !todo.completed });
      setTodos(todos.map((t) => (t._id === todo._id ? response.data : t)));
    } catch (err) { console.error(err); }
  };

  const toggleImportant = async (todo) => {
    try {
      const response = await axios.put(`${API_URL}/${todo._id}`, { isImportant: !todo.isImportant });
      setTodos(todos.map((t) => (t._id === todo._id ? response.data : t)));
    } catch (err) { console.error(err); }
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, { title: editText, deadline: editDeadline });
      setTodos(prev => prev.map((t) => (t._id === id ? response.data : t)));
      setEditingId(null);
    } catch (err) { console.error(err); }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-200 text-2xl font-mono animate-pulse">🐾 시간 여행 중...</div>;

  return (
    <div className="min-h-screen bg-black text-cyan-100 p-4 md:p-8 font-sans" style={{ backgroundImage: 'linear-gradient(rgba(17, 24, 39, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(17, 24, 39, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 bg-slate-950/70 p-8 rounded-xl border border-cyan-800 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <button onClick={() => changeDate(-1)} className="p-3 text-cyan-400 hover:text-pink-400">▶</button>
              <div className="text-center md:text-left">
                <div className="text-3xl font-black text-cyan-100 drop-shadow-[0_0_8px_#22d3ee]">{selectedDate.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</div>
                <div className="text-cyan-600 uppercase tracking-widest text-xs font-mono">{selectedDate.toLocaleDateString('ko-KR', { weekday: 'long' })}</div>
              </div>
              <button onClick={() => changeDate(1)} className="p-3 text-cyan-400 hover:text-pink-400">▶</button>
            </div>
            <div className="flex flex-col items-center bg-slate-900 px-8 py-4 rounded-xl border-2 border-cyan-500 shadow-[0_0_15px_#22d3ee]">
              <span className="text-[10px] text-cyan-400 uppercase tracking-widest mb-1 font-mono">Win Rate</span>
              <div className={`text-4xl font-black ${winRate >= 80 ? 'text-cyan-100' : winRate >= 50 ? 'text-amber-300' : 'text-pink-500'} font-mono drop-shadow-[0_0_5px]`} style={{ color: winRate >= 80 ? '#ffffff' : winRate >= 50 ? '#f59e0b' : '#ec4899' }}>{winRate}%</div>
              <div className="flex gap-2 mt-1 text-[10px] font-bold font-mono">
                <span className="text-cyan-400">S:{completedToday}</span>
                <span className="text-pink-400">F:{failedToday}</span>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-between items-center border-t border-cyan-800 pt-4 font-mono">
            <h1 className="text-lg font-bold text-cyan-300 drop-shadow-[0_0_5px_#22d3ee]">민수의 작업 게시판</h1>
            <div className="text-cyan-700 font-mono text-xs">{currentTime.toLocaleTimeString('ko-KR')}</div>
          </div>
        </header>

        <form onSubmit={addTodo} className="mb-10 p-6 bg-slate-950 rounded-xl border-2 border-cyan-700 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-3">
              <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder={`${selectedDate.getDate()}일의 계획을 입력하세요.`} className="flex-[2] px-5 py-3.5 bg-black rounded-xl text-white outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_#22d3ee] border border-cyan-800 transition" />
              <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="flex-1 px-4 py-3 bg-black rounded-xl text-white outline-none border border-cyan-800 focus:border-cyan-400" style={{ colorScheme: 'dark' }} />
              <button type="submit" className="px-8 py-3.5 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold font-mono text-black shadow-[0_0_10px_#22d3ee] transition-all duration-300 transform active:scale-95">추가</button>
            </div>
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm text-cyan-400 cursor-pointer">
                <input type="checkbox" onChange={(e) => setMidnight(e.target.checked)} className="w-4 h-4 rounded-none border-cyan-700 bg-black" />
                오늘 자정까지 완료
              </label>
              <button onClick={() => setSelectedDate(new Date())} className="text-xs text-pink-400 hover:underline">오늘로 가기</button>
            </div>
          </div>
        </form>

        <div className="space-y-4">
          {sortedTodos.length === 0 ? (
            <div className="text-center py-20 text-cyan-800 border-2 border-dashed border-cyan-900 rounded-3xl font-mono text-sm animate-pulse">이 날은 깨끗한 하루네요! ✨</div>
          ) : (
            sortedTodos.map((todo) => {
              const dDay = new Date(todo.deadline);
              const diffInMin = (dDay - currentTime) / (1000 * 60);
              const isOverdue = !todo.completed && diffInMin < 0; 
              let progress = 0;
              if (todo.deadline && !todo.completed && diffInMin > 0) {
                progress = diffInMin <= 60 ? (20 + ((60 - diffInMin) / 60) * 80) : (diffInMin <= 1440 ? (diffInMin / 1440) * 100 : 100);
              }

              return (
                <div key={todo._id} className={`group flex flex-col gap-3 p-5 rounded-xl border-2 transition duration-300 ${getUrgencyStyle(todo)}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      {isOverdue ? (
                        <div className="flex items-center justify-center h-6 w-6 rounded-none bg-pink-900/30 text-pink-500 border border-pink-500 font-black">X</div>
                      ) : (
                        <input type="checkbox" checked={todo.completed} onChange={() => toggleComplete(todo)} className="h-6 w-6 border-2 border-cyan-700 rounded-none checked:bg-cyan-600 transition cursor-pointer" />
                      )}
                      
                      <div className="flex flex-col flex-1 relative">
                        {editingId === todo._id ? (
                          <div className="flex flex-col md:flex-row gap-2">
                            <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} className="flex-[2] bg-black border border-cyan-500 rounded-lg px-3 py-1 text-white outline-none" autoFocus />
                            <input type="datetime-local" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)} className="flex-1 bg-black border border-cyan-500 rounded-lg px-2 py-1 text-sm text-white" style={{ colorScheme: 'dark' }} />
                            <button onClick={() => saveEdit(todo._id)} className="bg-cyan-600 px-4 py-1 rounded-lg text-sm font-bold text-black">저장</button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <span className={`text-lg font-medium transition relative font-mono tracking-wider ${todo.completed ? 'line-through text-cyan-800' : 'text-cyan-100'}`}>
                                {todo.title}
                                {isOverdue && <div className="absolute top-1/2 left-0 w-full h-[2px] bg-pink-600 border-t border-dashed border-pink-400 -translate-y-1/2 shadow-[0_0_5px_#ec4899]"></div>}
                              </span>
                              {!todo.completed && diffInMin > 0 && diffInMin <= 60 && <span className="text-[10px] bg-pink-600 text-black px-2 py-0.5 font-mono rounded-none animate-bounce">{Math.ceil(diffInMin)}분!</span>}
                              {isOverdue && <span className="text-[10px] bg-slate-800 text-pink-400 border border-pink-900 px-2 py-0.5 font-bold font-mono shadow-[0_0_5px_#ec4899]">TIME OVER</span>}
                            </div>
                            {todo.deadline && <span className={`text-xs mt-1 font-mono tracking-tight ${todo.completed ? 'text-cyan-900' : (isOverdue ? 'text-pink-500' : 'text-cyan-400')}`}>📅 마감: {new Date(todo.deadline).toLocaleString('ko-KR')}</span>}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleImportant(todo)} className={`p-2 rounded-lg transition ${todo.isImportant ? 'text-cyan-100 bg-cyan-600 shadow-[0_0_10px_#22d3ee]' : 'text-cyan-600 hover:text-cyan-300 hover:bg-slate-900'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill={todo.isImportant ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
                      </button>
                      <button onClick={() => { setEditingId(todo._id); setEditText(todo.title); const d = todo.deadline ? new Date(todo.deadline) : new Date(); const off = d.getTimezoneOffset() * 60000; setEditDeadline(new Date(d - off).toISOString().slice(0, 16)); }} className="p-2 bg-slate-900/50 rounded-lg text-cyan-600 hover:text-cyan-300 Transition"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg></button>
                      <button onClick={() => deleteTodo(todo._id)} className="p-2.5 bg-slate-900/50 rounded-lg text-cyan-600 hover:text-pink-500 Transition"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg></button>
                    </div>
                  </div>
                  {todo.deadline && !todo.completed && diffInMin > 0 && (
                    <div className="w-full h-1.5 bg-slate-900 rounded-none overflow-hidden mt-1 border border-cyan-900">
                      <div className={`h-full transition-all duration-1000 ${diffInMin < 60 ? 'bg-pink-500 shadow-[0_0_5px_#ec4899]' : diffInMin < 1440 ? 'bg-amber-400' : 'bg-cyan-400 shadow-[0_0_5px_#22d3ee]'}`} style={{ width: `${progress}%` }}></div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default App;