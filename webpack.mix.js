const mix = require('laravel-mix');
const globImporter = require('node-sass-glob-importer');

mix.js('resources/js/app.js', 'public/js')
    .js('resources/js/admin.js', 'public/js')
    .sass('resources/sass/app.scss', 'public/css')
    .sass('resources/sass/admin.scss', 'public/css')
    .version()
    .options({
        uglify: {
            parallel: 1,
            uglifyOptions: {
                mangle: false,
                compress: false
            }
        }
    })
    .sourceMaps();

mix.webpackConfig({
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: {
                    loader: 'sass-loader',
                    options: {
                        importer: globImporter()
                    }
                }
            }
        ]
    }
});
