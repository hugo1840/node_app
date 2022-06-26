const path = require('path')
const debug = process.env.NODE_ENV !== 'production'

module.exports = {
    publicPath: '/', // ����������Ŀ¼
    outputDir: 'dist', // �������Ŀ¼
    assetsDir: 'assets', // ��̬��ԴĿ¼ (js, css, img, fonts)
    lintOnSave: false, // �Ƿ���eslint�����⣬��Чֵ��ture | false | 'error'
    runtimeCompiler: true, // ����ʱ�汾�Ƿ���Ҫ����
    transpileDependencies: [], // Ĭ��babel-loader����mode_modules������������������������
    productionSourceMap: true, // �Ƿ��ڹ���������ʱ���� sourceMap �ļ���false����߹����ٶ�
    configureWebpack: config => { // webpack���ã�ֵλ����ʱ��ϲ����ã�Ϊ����ʱ���д����
        if (debug) { // ������������
            //config.devtool = 'cheap-module-eval-source-map'
            config.devtool = 'eval-cheap-module-source-map'
        } else { // ������������
        }
        // Object.assign(config, { // ����������ͬ����
        //     resolve: {
        //         alias: {
        //             '@': path.resolve(__dirname, './src'),
        //             '@c': path.resolve(__dirname, './src/components'),
        //             'vue$': 'vue/dist/vue.esm.js'
        //         }
        //     }
        // })
    },
    chainWebpack: config => { // webpack����API���������ɺ��޸�webapck���ã�https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
        if (debug) {
            // ���ؿ�������
        } else {
            // ������������
        }
    },
    parallel: require('os').cpus().length > 1, // ����ʱ��������̴���babel����
    pluginOptions: { // �������������
    },
    pwa: { // ��ҳ���������� https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    },
    devServer: {
        open: true,
        host: 'localhost',
        port: 8080,
        https: false,
        //hotOnly: false,
        hot: true,
        proxy: { // ���ÿ���
            '/api': {
                target: 'http://localhost:5001/api/',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
        //before: app => { }
        onBeforeSetupMiddleware: function (devServer) {
            if (!devServer) {
                throw new Error('webpack-dev-server is not defined');
            }

            devServer.app.get('/some/path', function (req, res) {
                res.json({ custom: 'response' });
            });
        }
    }
}
