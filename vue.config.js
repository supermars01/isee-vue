const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css', 'json', 'csv']
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  configureWebpack: config => {
    if (isProduction) {
      config.mode = "production"
      return {
        plugins: [
          new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'), //匹配文件名
            threshold: 10240, //对10K以上的数据进行压缩
            minRatio: 0.8,
            deleteOriginalAssets: false, //是否删除源文件
          })
        ]
      }
    }
  },
  chainWebpack: config => {
    config.module.rule('md')
      .test(/\.md/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('vue-markdown-loader/lib/markdown-compiler')
      .options({
        raw: true
      })
    config.module.rule('images')
      .test(/\.(png|jpe?g|gif)(\?.*)?$/)
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true
      })
      .end()
    config.module.rule('images')
      .test(/\.(png|jpe?g|gif)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 10000
      })
    if (isProduction) {
      if (process.env.npm_config_report) {
        config.plugin('webpack-bundle-analyzer')
          .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
          .end()
        config.plugins.delete('prefetch')
      }

    }
  },
  publicPath: process.env.NODE_ENV === 'production' ?'/isee-vue/' :'/',
  css: {
    extract: false,
    sourceMap: false,
    loaderOptions: {},
    modules: false
  }
}