export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-5">
      <h1 className="text-2xl font-bold mb-5">服务协议</h1>
      <p className="mb-3">欢迎使用 LinguaFlow。本协议内容包括您的权利义务等重要信息...</p>
      <ol className="list-decimal pl-6 text-gray-700">
        <li>您在注册前需仔细阅读并同意本协议各条款；</li>
        <li>我们将合法合规保护您的数据与隐私安全；</li>
        <li>严禁上传违法违规或侵权内容...</li>
        <li>LinguaFlow 拥有对本协议的最终解释权。</li>
        <li>更多内容详见 <a href="mailto:support@linguaflow.ai" className="text-fuchsia-600 underline">联系我们</a></li>
      </ol>
    </div>
  )
}
