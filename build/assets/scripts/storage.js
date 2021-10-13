const storage = window.localStorage;

/**
 * Check if an item exists for the given key
 *
 * @param key
 * @returns {boolean}
 */
export function has(key)
{
    return storage.getItem( key ) !== null
}

/**
 * Forget an item for the given key
 *
 * @param key
 */
export function forget(key)
{
    storage.removeItem( key );
}

/**
 * Get the item for the given key or return the default value
 *
 * @param key
 * @param defaultValue
 * @returns {null|any}
 */
export function get(key, defaultValue = null)
{
    if ( !has( key ) ) {
        return defaultValue;
    }

    const value = storage.getItem( key );

    try {
        return JSON.parse( value );
    } catch( e ) {
        return value;
    }
}

/**
 * Set an item with the given key
 *
 * @param key
 * @param value
 */
export function set(key, value)
{
    storage.setItem( key, JSON.stringify( value ) );
}

export default {
    has,
    forget,
    get,
    set
}