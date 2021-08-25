module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jsdoc: {
            configFile: 'jsdoc-conf.json',
            dest: 'output'
        },

        less: {
            development: {
                options: {
                    paths: ['<%= copy.assets.src %>/css']
                },
                files: {
                    '<%= copy.assets.dest %>/css/style.css': '<%= copy.assets.src %>/css/style.less'
                }
            }
        },

        shell: {
            'dev-guide': {
                command: 'cd developer-guide && sh grunt.sh'
            }
        },

        subst: {
            'dev-guide': {
                options: {
                    pattern: /\$dev-guide/ig,
                    relative: true,
                    base: 'output/developer-guide'
                },
                files: {
                    src: 'output/**/*.html'
                }
            },
            'api': {
                options: {
                    pattern: /\$api/ig,
                    relative: true,
                    base: 'output'
                },
                files: {
                    src: 'output/**/*.html'
                }
            },
            'index': {
                options: {
                    pattern: /\.\.\/#/g,
                    replacement: "../index.html#"
                },
                files: {
                    src: 'output/**/*.html'
                }
            },
            'date': {
                options: {
                    pattern: /{{ generated }}/g,
                    replacement: function() {
                        // Yes, obviously this doesn't need to be calculated each time.  You fix it.
                        var d_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                        var m_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                        var d = new Date();
                        var curr_day = d.getDay();
                        var curr_date = ("0" + d.getDate()).substr(-2);
                        var curr_month = d.getMonth();
                        var curr_year = d.getFullYear();

                        return d_names[curr_day] + ", " + m_names[curr_month] + " " + curr_date + ", " + curr_year;
                    }
                },
                files: {
                    src: 'output/**/*.html'
                }
            }
        },

        copy: {
            assets: {
                expand: true,
                src: 'assets/*',
                dest: '<%= jsdoc.dest %>'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-shell');

    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['jsdoc', 'less', 'shell', 'copy', 'subst']);
};
