const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const XMLDOM = require("xmldom");
const zipDir = require("zip-dir");

/**
 * Get the buffer image from an svg file
 *
 * @param file_path
 * @returns {*}
 */
function getBufferedFileFromSVG( file_path )
{
    let SVGParser = new XMLDOM.DOMParser().parseFromString( fs.readFileSync( file_path, 'utf-8'), 'text/xml');

    let svg_tag = SVGParser.getElementsByTagName('svg').item( 0 );

    svg_tag.setAttribute('width', '100em');
    svg_tag.setAttribute('height', '100em');

    return sharp( Buffer.from(
        new XMLDOM.XMLSerializer().serializeToString( SVGParser )
    ) )
    .resize( { width: 255, height: 255, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } } );
}

/**
 * Get a buffer image to manipulate
 *
 * @param file_path
 * @returns {*|Sharp}
 */
function getBufferedFile( file_path )
{
    const ext = path.parse( file_path ).ext.substr( 1 );

    return ( ext === 'svg' ) ? getBufferedFileFromSVG( file_path ) : sharp( file_path );
}

/**
 * Get the manifest content
 *
 * @returns Object
 */
function getManifest()
{
    return {
        "name": "App",
        "icons": [
            {
                "src": "\/favicon-36x36.png",
                "sizes": "36x36",
                "type": "image\/png",
                "density": "0.75"
            },
            {
                "src": "\/favicon-48x48.png",
                "sizes": "48x48",
                "type": "image\/png",
                "density": "1.0"
            },
            {
                "src": "\/favicon-72x72.png",
                "sizes": "72x72",
                "type": "image\/png",
                "density": "1.5"
            },
            {
                "src": "\/favicon-96x96.png",
                "sizes": "96x96",
                "type": "image\/png",
                "density": "2.0"
            },
            {
                "src": "\/favicon-144x144.png",
                "sizes": "144x144",
                "type": "image\/png",
                "density": "3.0"
            },
            {
                "src": "\/favicon-192x192.png",
                "sizes": "192x192",
                "type": "image\/png",
                "density": "4.0"
            }
        ]
    };
}

/**
 * Generate the manifest.json file
 *
 * @param destination_path
 * @param manifest
 */
function generateManifest( destination_path, manifest )
{
    fs.writeFileSync( destination_path + 'manifest.json', JSON.stringify( manifest ) );
}

/**
 * Make a folder if it not exists
 *
 * @param folder_path
 */
function makeFolder( folder_path )
{
    if ( !fs.existsSync( folder_path ) ) {
        fs.mkdirSync( folder_path );
    }
}

/**
 * Make an image file. If the name is not passed, generate it based on size
 *
 * @param original_file
 * @param destination_path
 * @param size
 * @param ext
 * @param name
 * @returns {Promise<void>}
 */
async function makeFile(original_file, destination_path, size, ext, name = null)
{
    if ( name === null ) {
        name = 'favicon-' + size + 'x' + size;
    }

    await original_file
        .clone()
        .png( { palette: true } )
        .resize({ width: size, height: size, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } } )
        .toFile(destination_path + name + '.' + ext );
}

/**
 * Remove a folder and it's content
 *
 * @param folder_path
 */
function removeFolderRecursive( folder_path )
{
    if ( fs.existsSync( folder_path ) ) {
        fs.readdirSync( folder_path ).forEach( function ( file, index) {
            const current_path = folder_path + '/' + file;

            if ( fs.lstatSync( current_path ).isDirectory() ) {
                removeFolderRecursive( current_path );
            } else {
                fs.unlinkSync( current_path );
            }
        } );

        fs.rmdirSync( folder_path );
    }
}

/**
 * Zip a folder
 *
 * @param folder_path
 * @returns {*}
 */
function zipFolder( folder_path )
{
    const parse = path.parse( folder_path );

    const destination_path = parse.dir + '/' + parse.name + '.zip';

    return zipDir( folder_path, { saveTo: destination_path } );
}

module.exports = {
    getBufferedFileFromSVG,
    getBufferedFile,
    getManifest,
    generateManifest,
    makeFile,
    makeFolder,
    removeFolderRecursive,
    zipFolder,
};