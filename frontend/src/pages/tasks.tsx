import React, { useState } from 'react';
import TaskList from '../components/TaskList';
import TaskStatus from '../components/TaskStatus';

const TasksPage: React.FC = () => {
  const [token, setToken] = useState(''); // 实际可接入全局登录状态
  const [taskId, setTaskId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-xl font-bold my-4">我的全部任务</h1>
      <TaskList token={token} onSelect={setTaskId} />
      {taskId && <TaskStatus taskId={taskId} token={token} />}
    </div>
  );
};
export default TasksPage;
