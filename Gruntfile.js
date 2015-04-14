module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
                ' * <%= pkg.name %> v<%= pkg.version %>\n' +
                ' * @license <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
                ' * <%= grunt.template.today("yyyy") %>\n' +
                ' */\n',
    concat: {
      options: {
        separator: '\n',
        stripBanners: false
      },
      modernizr: {
        src: ['vendor/modernizr.mq.min.js', 'lib/parallax.js'],
        dest: 'lib/parallax.mq.js'
      },
      dist: {
        src: ['vendor/modernizr.mq.min.js', 'dist/parallax.min.js'],
        dest: 'dist/parallax.mq.min.js'
      },
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: 'lib/parallax.js',
        dest: 'dist/parallax.min.js'
      },
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        options: {
          jshintrc: 'lib/.jshintrc'
        },
        src: ['lib/parallax.js']
      }
    },
    watch: {
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'concat:modernizr']
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task. Build.
  grunt.registerTask('default', ['jshint', 'uglify:dist', 'concat:modernizr', 'concat:dist']);
};
