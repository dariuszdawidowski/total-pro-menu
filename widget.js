/**
 * Total Pro Menu Widget base class
 * (c) 2020-2024 Dariusz Dawidowski, All Rights Reserved.
 */

/**
 * Menu widget base for everything
 */

class TotalProMenuWidget {

    /**
     * Constructor
     */

    constructor(params = {}) {
        // Parent widget
        this.parent = null;

        // DOM elements
        this.element = document.createElement('div');

        // ID
        this.id = 'id' in params ? params.id : ('text' in params) && (typeof(params.text) == 'string') ? `total-pro-menu-${params.text.slug()}` : `total-pro-menu-${crypto.randomUUID()}`;
        this.element.id = this.id;

        // Children Widgets
        this.widgets = [];
       
        // Disabled
        this.disabled = false;

        // Display method
        this.display = 'block';
    }

    /**
     * Enable this widget and childrens
     */

    enable() {

        // Enable children widgets
        for (const widget of this.widgets || []) widget?.enable();

        // Enable itself
        this.element.classList.remove('disabled');
        this.disabled = false;

        return this;
    }

    /**
     * Disable this widget and childrens
     */

    disable() {

        // Disable children widgets
        for (const widget of this.widgets || []) widget?.disable();

        // Disable itself
        this.element.classList.add('disabled');
        this.disabled = true;
    }

    /**
     * Select widget
     */

    select() {

        // Select itself only
        this.element.classList.add('selected');
    }

    /**
     * Deselect widget
     */

    deselect() {

        // Deselect children widgets
        for (const widget of this.widgets || []) widget?.deselect();

        // Deselect itself
        this.element.classList.remove('selected');
    }
    blur() { this.deselect() }

    /**
     * Add widget
     */

    add(widget) {
        widget.parent = this;
        this.element.appendChild(widget.element);
        this.widgets.push(widget);
        return widget;
    }

    /**
     * Remove widget(s)
     */

    del(widgets = null) {
        // Remove all widgets
        if (widgets === null) {
            for (const widget of this.widgets) {
                widget.element.remove();
            }
            this.widgets = [];
        }
        return true;
    }

    /**
     * Show widget
     */

    show() {
        this.element.style.display = this.display;
    }

    /**
     * Hide widget
     */

    hide() {
        if (this.element.style.display && this.element.style.display != 'none') this.display = this.element.style.display;
        this.element.style.display = 'none';
    }

    /**
     * Find widget
     */

    find(id) {
        if (this.id == id) return this;
        for (const widget of this.widgets || []) {
            const found = widget?.find(id); 
            if (found) return found;
        }
        return null;
    }

    /**
     * Editable
     */

    readOnly(state) {
        this.element.readOnly = state;
    }

    /**
     * Title hover cloud
     */

    tooltip(text) {
        this.element.title = text;
    }

    /**
     * Update for dynamic widgets
     */

    update() {
        /* OVERLOAD */
    }

}
