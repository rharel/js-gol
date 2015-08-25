/**
 * @author Raoul Harel
 * @license The MIT license (LICENSE.txt)
 * @copyright 2015 Raoul Harel
 * @url https://github.com/rharel/js-gol
 */

module.exports = function(grunt) {

  config = {
    pkg: grunt.file.readJSON('package.json'),
    src_dir: 'src/',
    test_dir: 'test/',
    dist_dir: 'dist/',

    jshint: {
      all: [
        '<%= src_dir %>**/*.js',
        '<%= test_dir %>/js/*.js'
      ]
    },

    clean: {
      release: {
        src: [
          '<%= dist_dir %>**/*.js'
        ]
      }
    },

    copy: {
      release: {
        src: '<%= src_dir %>/World.js',
        dest: '<%= dist_dir %>/gol.js'
      }
    },

    mochacli: {
      options: {
        require: ['chai'],
        reporter: 'spec',
        bail: true
      },
      all: '<%= test_dir %>/*.test.js'
    },

    uglify: {
      release: {
        files: {
          '<%= dist_dir %>/gol.min.js': ['<%= src_dir %>/World.js']
        }
      }
    }
  };

  grunt.registerTask('build', [
    'clean:release',
    'copy:release',
    'uglify:release'
  ]);
  grunt.registerTask('test', ['mochacli:all']);
  grunt.registerTask('dev', [
    'jshint:all',
    'test'
  ]);
  grunt.registerTask('release', [
    'jshint:all',
    'test',
    'build'
  ]);
  grunt.registerTask('default', 'dev');

  require('load-grunt-tasks')(grunt);

  return grunt.initConfig(config);
};