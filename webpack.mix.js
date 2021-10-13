const mix = require('laravel-mix');

mix.webpackConfig({
    target: 'electron-renderer',
});

mix.js('build/assets/scripts/main.js', 'scripts');

mix.sass('build/assets/styles/main.scss', 'styles')
    .options({
        processCssUrls: false
    });

mix.sass('build/assets/styles/regular-theme.scss', 'styles')
    .options({
        processCssUrls: false
    });

mix.sass('build/assets/styles/cherry-pulp.scss', 'styles')
    .options({
        processCssUrls: false
    });

mix.setPublicPath('build/render');

mix.disableNotifications();