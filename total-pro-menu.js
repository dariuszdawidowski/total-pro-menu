/**
 * Total Pro Menu
 * (c) 2020-2023 Dariusz Dawidowski, All Rights Reserved.
 */

/**
 * Main menu
 */

class TotalProMenu {

    constructor(params) {

        // Initial click coordinates
        this.click = {x: 0, y: 0};

        // DOM elements
        this.element = document.createElement('div');
        this.element.id = 'menu';

        // Panels
        this.panel = {
            left: new MenuPanel({ id: 'menu-left' }),
            right: new MenuPanel({ id: 'menu-right' })
        };
        this.element.appendChild(this.panel.left.element);
        this.element.appendChild(this.panel.right.element);
        if ('container' in params) this.append(params.container);

        // Assign events callbacks
        this.outclickEvent = this.outclick.bind(this);
        this.scrollEvent = this.scroll.bind(this);
    }

    /**
     * Show menu at position
     * params:
     * left - x coordinate of click
     * top - y coordinate of click
     */

    show(params) {

        // Bind events
        document.body.addEventListener('pointerup', this.outclickEvent);
        this.element.addEventListener('wheel', this.scrollEvent);

        // Align click to menu size
        let left = this.click.x = params.left;
        let top = this.click.y = params.top;
        if (window.scrollX + window.innerWidth - left - this.width() < 0) left = window.scrollX + window.innerWidth - this.width();
        if (window.scrollY + window.innerHeight - top - this.height() < 0) top = window.scrollY + window.innerHeight - this.height();

        // Show DOM element
        this.element.style.left = left + 'px';
        this.element.style.top = top + 'px';
        this.element.style.visibility = 'visible';

    }

    /**
     * Hide menu
     */

    hide() {

        // Hide element
        this.element.style.visibility = 'hidden';

        // Unbind events
        document.body.removeEventListener('pointerup', this.outclickEvent);
        this.element.removeEventListener('wheel', this.scrollEvent);

    }

    /**
     * Append menu to html DOM
     */

    append(element) {
        (element || document.getElementsByTagName('body')[0]).appendChild(this.element);
    }

    /**
     * Is menu visible?
     */

    visible() {
        return this.element.style.visibility == 'visible';
    }

    /**
     * Return position
     * kind:
     * first click - click where menu was activated
     * menu corner - left corner of menu
     */

    position(kind = 'menu corner') {
        if (kind == 'first click') return this.click;
        else if (kind == 'menu corner') return {x: this.element.style.left.pxToInt(), y: this.element.style.top.pxToInt()};
    }

    /**
     * Get width
     */

    width() {
        return this.element.offsetWidth;
    }

    /**
     * Get height
     */

    height() {
        return this.element.offsetHeight;
    }

    /**
     * Identify DOM target: is it part of menu?
     */

    identify(target) {
        const menu = document.getElementById('menu');
        if (menu) return menu.contains(target);
        return false;
    }

    /**
     * Mouse clicked outside of menu
     */

    outclick() {
        if (this.visible() && this.identify(event.target) == false) {
            this.hide();
        }
    }

    /**
     * Mouse scroll
     */

    scroll(event) {
        this.element.dispatchEvent(new CustomEvent('scroll', { detail: event.wheelDeltaY }));
    }

}
