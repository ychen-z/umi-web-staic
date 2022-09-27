import { defineConfig } from 'umi';
import route from '../src/routes';
import theme from './theme';
// import qiankun from './qiankun';

console.log('SSC_ENV', process.env.SSC_ENV);
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  history: {
    type: 'hash',
  },
  // routes: [
  //   { path: '/', component: '@/pages/index' },
  // ],
  analyze: {
    analyzerMode: 'server',
    analyzerPort: 8888,
    openAnalyzer: true,
    // generate stats file while ANALYZE_DUMP exist
    generateStatsFile: false,
    statsFilename: 'stats.json',
    logLevel: 'info',
    defaultSizes: 'parsed', // stat  // gzip
  },
  // styleLoader: {},
  theme,
  // qiankun,
  outputPath: 'build',
  lessLoader: {
    modifyVars: {
      hack: `true; @import "~@/assets/css/reset.less";`,
    },
  },
  targets: {
    ie: 11,
  },
  devServer: {
    host: '0.0.0.0',
    port: 8000,
  },
  locale: {
    default: 'zh-CN',
    antd: true,
    title: true,
    baseNavigator: true,
    baseSeparator: '-',
  },
  request: {
    dataField: 'data',
  },
  dynamicImport: {
    loading: '@/components/loading',
  },
  routes: route.routes,
  fastRefresh: {},
  webpack5: {},
  // mfsu: {}, // 有bug，等umi更新
  proxy: {
    '/mock/dev': {
      target: 'http://ehr-service-dev.netease.com',
      secure: false,
      pathRewrite: {
        '^/mock/dev': '',
      },
      changeOrigin: true,
    },
    '/mock/test': {
      target: 'http://ehr-service-test.netease.com',
      secure: false,
      pathRewrite: {
        '^/mock/test': '',
      },
      changeOrigin: true,
    },
    // 本地开发时，调用第三方服务的代理配置
    '/api': {
      target: 'http://ehr-service-test.netease.com',
      secure: false,
      changeOrigin: true,
    },
  },
});
