// next.config.js
module.exports = {
  reactStrictMode: true,
  // 出力モードは standalone でも OK
  output: 'standalone',
  // クライアントに埋め込みたい変数
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}