import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from "unplugin-auto-import/vite";
import ReactivityTransform from '@vue-macros/reactivity-transform/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import {nodePolyfills} from 'vite-plugin-node-polyfills';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),ReactivityTransform(), // 启用响应式语法糖 $ref ...
     AutoImport({
      imports: ["vue", "vue-router"],
       resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    nodePolyfills(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // 添加以下别名解决路径问题
      'element-plus/es/components/config-provider/src/hooks/use-window-config.mjs':
          'element-plus/es/components/config-provider/src/hooks/use-global-config.mjs',
      'element-plus/es/hooks/use-prevent-window/index.mjs':
          'element-plus/es/hooks/use-prevent-global/index.mjs',
    },
  },
  define: {
    global: 'window', // 将 global 定义为 window
  },
  build: {
    rollupOptions: {
      external: ['window'], // 外部化 window 模块
    },
  },
});
