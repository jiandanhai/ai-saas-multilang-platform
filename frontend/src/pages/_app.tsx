// pages/_app.tsx 美化全局背景与布局
import '../styles/tailwind.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen bg-gradient-brand bg-no-repeat bg-fixed">
      <Component {...pageProps} />
    </div>
  );
}
