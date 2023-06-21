const mix = require('laravel-mix');

mix.webpackConfig({
    target: 'electron-renderer',
} );

mix.js('build/assets/scripts/main.js', 'scripts');

const sass_options = {
    processCssUrls: false
};

mix.sass('build/assets/styles/main.scss', 'styles')
    .options( sass_options );

mix.sass('build/assets/styles/light-theme.scss', 'styles')
    .options( sass_options );

mix.sass('build/assets/styles/dark-theme.scss', 'styles')
    .options( sass_options );

mix.sass('build/assets/styles/user-preference.scss', 'styles')
    .options( sass_options );

mix.setPublicPath('build/render');

mix.disableNotifications();