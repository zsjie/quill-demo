const serveStatic = require('serve-static')

module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt)

  grunt.initConfig({
    watch: {
      livereload: {
        options: {
          livereload: true
        },
        files: [
          'styles/**/*.css',
          'scripts/**/*.js',
          'index.html'
        ]
      }
    },

    // 设置并启动一个服务器
    connect: {
      options: {
        // 设置为 * 或者 0.0.0.0 可以使同一个局域网内的其他设备也能访问
        // 这样可以方便手机或者平板调试
        hostname: 'localhost',
        port: 9010, // 指定端口
        open: true, // 启动服务器时自动打开浏览器窗口
        livereload: true // 服务器端也要开启 livereload
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              // 设置根目录为项目根目录
              serveStatic('.')
            ]
          }
        }
      }
    }
  })

  grunt.registerTask('server', 'start the grunt server',function (target) {
    grunt.task.run(['connect', 'watch']);
  });

  grunt.registerTask('default', ['server'])
}