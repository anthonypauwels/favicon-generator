const mix = require('laravel-mix');

mix.webpackConfig({
    target: 'electron-renderer',
});

mix.js('app/assets/scripts/main.js', 'scripts');

mix.sass('app/assets/styles/main.scss', 'styles')
    .options({
        processCssUrls: false
    });

mix.sass('app/assets/styles/regular-theme.scss', 'styles')
    .options({
        processCssUrls: false
    });

mix.sass('app/assets/styles/cherry-pulp.scss', 'styles')
    .options({
        processCssUrls: false
    });

mix.setPublicPath('app/render');

mix.disableNotifications();