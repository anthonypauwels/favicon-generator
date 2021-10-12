import { ipcRenderer } from 'electron';
import { click, drag, change, find } from './helpers';
import storage from './storage';

const linkTheme = find('#link-theme');

function changeTheme(theme)
{
    storage.set('theme', theme );
    linkTheme.setAttribute('href', 'styles/' + theme + '.css');
}

ipcRenderer.on('theme', ( event, theme ) => {
    changeTheme( theme );
} );

changeTheme( storage.get('theme', 'regular-theme' ) );

const zipFolder = find('#zip-folder');

zipFolder.checked = storage.get('zip-folder', false );

change( zipFolder, () => {
    storage.set('zip-folder', zipFolder.checked );
} );

const html_code = '<link rel="apple-touch-icon" sizes="57x57" href="/favicon-57x57.png">\n' +
    '<link rel="apple-touch-icon" sizes="60x60" href="/favicon-60x60.png">\n' +
    '<link rel="apple-touch-icon" sizes="72x72" href="/favicon-72x72.png">\n' +
    '<link rel="apple-touch-icon" sizes="76x76" href="/favicon-76x76.png">\n' +
    '<link rel="apple-touch-icon" sizes="114x114" href="/favicon-114x114.png">\n' +
    '<link rel="apple-touch-icon" sizes="120x120" href="/favicon-120x120.png">\n' +
    '<link rel="apple-touch-icon" sizes="144x144" href="/favicon-144x144.png">\n' +
    '<link rel="apple-touch-icon" sizes="152x152" href="/favicon-152x152.png">\n' +
    '<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">\n' +
    '<link rel="icon" type="image/png" sizes="192x192"  href="/favicon-192x192.png">\n' +
    '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n' +
    '<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">\n' +
    '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n' +
    '<link rel="manifest" href="/manifest.json">\n' +
    '<meta name="msapplication-TileColor" content="#ffffff">\n' +
    '<meta name="msapplication-TileImage" content="/favicon-144x144.png">\n' +
    '<meta name="theme-color" content="#ffffff">';

const tooltip = find('#tooltip');

let timeout = null;

click('#copy-code', () => {
    navigator.clipboard.writeText( html_code );

    tooltip.classList.add('show');

    clearTimeout( timeout );

    timeout = setTimeout( () => {
        tooltip.classList.remove('show');
    }, 5000 );
} );

let process = false;

function processImage(file_path)
{
    process = true;

    const zip_folder = zipFolder.checked;

    ipcRenderer.send('generate-images', {
        file_path, zip_folder
    } );
}

const fileInput = find('#input-file');

click('#select-file', e => {
    e.preventDefault();

    click( fileInput );
} );

change( fileInput, () => {
    if ( fileInput.files[0] !== undefined ) {
        processImage( fileInput.files[0].path );
    }
} );

const dropArea = find( '#drop-area' );

drag( dropArea, {
    over(e)
    {
        e.preventDefault();

        dropArea.classList.add('dragover');

        return false;
    },

    leave()
    {
        dropArea.classList.remove('dragover');

        return false;
    },

    end()
    {
        return false;
    },

    drop(e)
    {
        e.preventDefault();

        dropArea.classList.remove('dragover');

        if ( e.dataTransfer.files[0] !== undefined ) {
            processImage( e.dataTransfer.files[0].path );
        }

        return false;
    }
} );

ipcRenderer.on('favicon-generated', () => {
    process = false;

    fileInput.value = '';
});