/**
 * Total Pro Menu
 * (c) 2020-2024 Dariusz Dawidowski, All Rights Reserved.
 */

class TotalProMenu {

    /**
     * Constructor
     * @param args.container - container to attach to
     */

    constructor(args) {

        // Initial click coordinates
        this.click = {x: 0, y: 0};

        // DOM elements
        this.element = document.createElement('div');
        this.element.id = 'menu';

        // Panels
        this.panel = {
            left: new TotalProMenuPanel({ id: 'menu-left' }),
            right: new TotalProMenuPanel({ id: 'menu-right' })
        };
        this.element.append(this.panel.left.element);
        this.element.append(this.panel.right.element);

        // Attach to parent container
        this.append(args.container);

        // Assign events callbacks
        this.outclickEvent = this.outclick.bind(this);
        this.scrollEvent = this.scroll.bind(this);
    }

    /**
     * Show menu at position
     * @param args.left: x coordinate of click
     * @param args.top: y coordinate of click
     */

    show(args) {

        // Align click to menu size
        let left = this.click.x = args.left;
        let top = this.click.y = args.top;
        if (window.scrollX + window.innerWidth - left - this.width() < 0) left = window.scrollX + window.innerWidth - this.width();
        if (window.scrollY + window.innerHeight - top - this.height() < 0) top = window.scrollY + window.innerHeight - this.height();

        // Show DOM element
        this.element.style.left = left + 'px';
        this.element.style.top = top + 'px';
        this.element.style.visibility = 'visible';

        // Bind events
        document.body.addEventListener('pointerdown', this.outclickEvent);
        this.element.addEventListener('wheel', this.scrollEvent);

        // Update all widgets
        this.update(this.panel.left.widgets.concat(this.panel.right.widgets));
    }

    /**
     * Hide menu
     */

    hide() {

        // Hide element
        this.element.style.visibility = 'hidden';

        // Unbind events
        document.body.removeEventListener('pointerdown', this.outclickEvent);
        this.element.removeEventListener('wheel', this.scrollEvent);

    }

    /**
     * Append menu to html DOM
     * @param element: attach to this element
     */

    append(element) {
        (element || document.getElementsByTagName('body')[0]).append(this.element);
    }

    /**
     * Is menu visible?
     */

    visible() {
        return this.element.style.visibility == 'visible';
    }

    /**
     * Return position
     * @param kind:
     *        'first click': click where menu was activated
     *        'menu corner': left corner of menu
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
     * Callback: mouse clicked inside or outside of menu
     */

    outclick(event) {
        if (this.visible() && !this.element.contains(event.target)) {
            this.hide();
        }
    }

    /**
     * Callback: mouse scroll
     */

    scroll(event) {
        this.element.dispatchEvent(new CustomEvent('scroll', { detail: event.wheelDeltaY }));
    }

    /**
     * Update for dynamic widgets
     */

    update(widgets) {
        widgets.forEach(widget => {
            if (widget) {
                widget.update();
                this.update(widget.widgets);
            }
        });
    }

}
