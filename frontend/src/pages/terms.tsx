const Terms: React.FC = () => (
  <main className="max-w-2xl mx-auto my-12 px-4">
    <h1 className="text-2xl font-bold mb-4">服务协议</h1>
    <div className="text-gray-700 space-y-2 text-sm">
      <p>欢迎使用本平台。注册/使用即表示您同意遵守以下服务条款：</p>
      <ul className="list-disc pl-6">
        <li>请保证注册信息的真实合法，严禁非法用途。</li>
        <li>未注册用户可试用部分功能，超额后请注册升级。</li>
        <li>用户数据加密处理，遵循隐私保护协议。</li>
        <li>如有违规操作，平台有权暂停服务。</li>
      </ul>
      <p className="mt-4">完整协议内容请联系运营团队。</p>
    </div>
  </main>
);

export default Terms;
