module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: ';',
                stripBanners: true
            },
            dist: {
                src: [
                    "jquery.xslider.js"
                ],
                dest: "dist/jquery.xslider.min.js"
            }
        },
        uglify: {
            options: {},
            dist: {
                files: {
                    'dist/jquery.xslider.min.js': 'jquery.xslider.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['concat', 'uglify']);
}
