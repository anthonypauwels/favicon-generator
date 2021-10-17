const { app, BrowserWindow,  ipcMain, shell, Menu } = require('electron');
const Generator = require('./includes/Generator');
const path = require('path');

const dev_mode = false;

let window;

function createWindow ()
{
    window = new BrowserWindow( {
        title: 'Favicon Generator',
        titleBarStyle: 'hiddenInset',
        icon: path.join( __dirname, './render/images/icon.ico' ),
        width: 600,
        height: 450,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    } );

    window.loadFile( path.join( __dirname, './render/index.html' ) ).catch( ( reason ) => {
        console.error( reason );

        app.quit();
    } );

    window.on('closed', () => {
        window = null
    } );

    window.on('page-title-updated', function(e) {
        e.preventDefault()
    } );
}

const template = [
    {
        label: 'File',
        submenu: [
            { label: 'Theme', submenu: [
                { label: 'Regular Theme', click: () => {
                    window.webContents.send('theme', 'regular-theme');
                } },
                { label: 'Make It Pulp', click: () => {
                    window.webContents.send('theme', 'cherry-pulp');
                } },
            ] },
            { type: 'separator' },
            { role: 'reload' },
            { role: 'minimize' },
            (dev_mode ? { role: 'toggledevtools' } : { type: 'separator' }),
            { type: 'separator' },
            { role: 'quit' },
        ]
    },
];

const menu = Menu.buildFromTemplate( template );
Menu.setApplicationMenu(menu);

app.on('ready', createWindow );

app.on('window-all-closed', () => {
    app.quit();
} );

app.on('activate', () => {
    if ( window === null ) {
        createWindow();
    }
} );

const sizes = {
    png: [ 16, 32, 36, 48,
           57, 60, 72, 76,
           96, 114, 120, 144,
           152, 180, 192, 255,
        ],
};

ipcMain.on('generate-images', async (event, payload) => {
    const { file_path, zip_folder } = payload;

    const parse = path.parse( file_path );
    const file_name = parse.name;

    let destination_path = parse.dir + '/' + file_name + '-favicon/';

    Generator.makeFolder( destination_path );

    const original_file = Generator.getBufferedFile( file_path );

    await Generator.makeFile( original_file, destination_path, 48, 'ico', 'favicon');

    for ( const size of sizes.png ) {
        await Generator.makeFile( original_file, destination_path, size, 'png');
    }

    Generator.generateManifest( destination_path , Generator.getManifest() );

    if ( zip_folder ) {
        Generator.zipFolder( destination_path ).then( () => {
            Generator.removeFolderRecursive( destination_path );
        } );
    }

    event.reply( 'favicon-generated', true );

    await shell.openPath( path.parse( destination_path ).dir );
    shell.showItemInFolder( destination_path );
} );