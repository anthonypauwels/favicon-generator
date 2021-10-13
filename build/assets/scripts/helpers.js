/**
 * Select a DOM element
 *
 * @param selector
 * @returns {*}
 */
export function find(selector)
{
    return document.querySelector( selector );
}

/**
 * Select many DOM elements
 *
 * @param selector
 * @returns {NodeListOf<*>}
 */
export function findAll(selector)
{
    return document.querySelectorAll( selector );
}

/**
 * Listen an event for one or many elements
 *
 * @param el
 * @param event
 * @param callback
 */
export function on( el, event, callback )
{
    if ( typeof el === 'string') {
        el = findAll( el );
    }

    if ( el.length ) {
        el.forEach( el => {
            on( el, event, callback );
        } );

        return;
    }

    if ( el.addEventListener ) {
        el.addEventListener(event, callback, false)
    }
}

/**
 * Listen or trigger the event click (if callback is not passed) for one or many elements
 *
 * @param el
 * @param callback
 */
export function click(el, callback = null)
{
    if ( callback === null ) {
        if ( el.length ) {
            el.forEach( el => {
                el.click();
            } );
        } else {
            el.click();
        }

        return;
    }

    return on( el, 'click', callback );
}

/**
 * Listen or trigger the event change (if callback is not passed) for one or many elements
 *
 * @param el
 * @param callback
 */
export function change(el, callback = null)
{
    if ( callback === null ) {
        if ( el.length ) {
            el.forEach( el => {
                el.change();
            } );
        } else {
            el.change();
        }

        return;
    }

    return on( el, 'change', callback );
}

/**
 * Apply many listener for drag events :
 * drag
 * dragstart
 * dragend
 * dragover
 * dragenter
 * dragleave
 * drop
 *
 * @param el
 * @param callbacks
 */
export function drag(el, callbacks)
{
    Object.keys( callbacks ).forEach( event => {
        if ( event === 'drag' ) {
            on( el, 'drag', callbacks[ event ] );
            return;
        }

        if ( event === 'drop' ) {
            on( el, 'drop', callbacks[ event ] );
            return;
        }

        on( el, 'drag' + event, callbacks[ event ] );
    } );
}

export default {
    find,
    findAll,
    on,
    click,
    drag,
    change,
}