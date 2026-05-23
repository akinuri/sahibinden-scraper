module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-terser");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        concat: {
            options: {
                separator: "\n\n",
                process: function (src, filepath) {
                    let filename = filepath.split("/").pop();
                    filename = filename.replace(".js", "");
                    // Convert camelCase or PascalCase to space-separated, all-caps
                    filename = filename.replace(/([a-z])([A-Z])/g, '$1 $2');
                    filename = filename.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
                    filename = filename.toUpperCase();
                    src = src.trim();
                    return `// #region ==================== ${filename}\n\n${src}\n\n// #endregion`;
                },
            },
            dist: {
                src: [
                    "src/fieldsAndPaths.js",
                    "src/utils.js",
                    "src/sahibinden.js",
                    "src/helpers.js",
                    "src/main.js",
                ],
                dest: "scrape.js",
            },
        },

        terser: {
            dist: {
                files: {
                    "scrape.min.js": ["scrape.js"],
                },
            },
        },

        watch: {
            scripts: {
                files: ["src/**/*.js"],
                tasks: ["build"],
                options: {
                    spawn: false,
                },
            },
            equipments: {
                files: ["src/equipments.json", "src/equipments-scraper.js"],
                tasks: ["build:equipments"],
                options: {
                    spawn: false,
                },
            },
        },
    });

    grunt.registerTask("build:equipments", "Inject equipments JSON into scraper output", function () {
        const jsonPath = "src/equipments.json";
        const templatePath = "src/equipments-scraper.js";
        const outputPath = "equipments-scraper.js";
        const placeholder = "__EQUIPMENTS_DATA__";

        const equipments = grunt.file.readJSON(jsonPath);
        const template = grunt.file.read(templatePath);
        const payload = JSON.stringify(equipments, null, 4);

        if (!template.includes(placeholder)) {
            grunt.fail.fatal(`Placeholder ${placeholder} not found in ${templatePath}`);
        }

        const output = template.replace(placeholder, payload);
        grunt.file.write(outputPath, output);
        grunt.log.writeln(`File ${outputPath} created.`);
    });

    grunt.registerTask("build", ["concat", "terser"]);
    grunt.registerTask("default", ["build", "watch"]);
};
