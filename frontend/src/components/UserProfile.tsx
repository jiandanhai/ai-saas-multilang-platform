import React from 'react';

interface UserProfileProps {
  username: string;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ username, onLogout }) => (
  <div className="p-4 border rounded bg-white flex flex-col items-center mb-4">
    <span className="font-bold text-lg mb-2">欢迎，{username}！</span>
    <button
      className="bg-gray-400 text-white px-4 py-1 rounded mt-2 hover:bg-gray-500"
      onClick={onLogout}
    >
      退出登录
    </button>
    {/* 如需个人资料编辑/修改密码/团队切换等，可在这里拓展更多内容 */}
  </div>
);

export default UserProfile;
