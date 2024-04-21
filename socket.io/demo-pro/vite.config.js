import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
const root = process.cwd()
export default ({command, mode}) => {
  const env = loadEnv(mode, root)
  return {
    plugins: [vue()],
    server: {
      host: '0.0.0.0', //自定义主机名
      port: env.VITE_PORT, // 自定义端口
      open: true, // 自动在浏览器打开
      https: false, // 是否开启 https
      // 设置反向代理，跨域
      proxy: {
        '/api': {
          // 后台地址
          target: 'http://127.0.0.1:8000/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
}
