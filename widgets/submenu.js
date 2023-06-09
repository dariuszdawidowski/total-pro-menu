/**
 * Total Pro Menu Widget Submenu
 * (c) 2020-2023 Dariusz Dawidowski, All Rights Reserved.
 */

class TotalProSubMenu extends TotalProMenuWidget {

    constructor(params) {
        super(params);

        const { text, selected, disabled, callback } = params;

        this.text = text;
        this.selected = selected;
        this.disabled = disabled;
        this.callback = callback;

        // Main element
        this.element.classList.add('submenu');
        this.element.classList.toggle('disabled', this.disabled == true);
        this.element.innerHTML = `<p class="submenu-text">${this.text}</p><span>&rsaquo;</span>`;

        // Callback
        this.element.addEventListener('click', () => {
            if (!this.disabled) {
                this.parent.deselect();
                this.select();
                if (this.callback) this.callback();
            }
        });

        // Container element
        this.panel = document.createElement('div');
        this.panel.classList.add('submenu-panel');
        this.element.appendChild(this.panel);

        // Selected
        this.selected ? this.select() : this.deselect();
    }

    // Add widget

    add(widget) {
        this.panel.appendChild(widget.element);
        this.widgets.push(widget);
        return widget;
    }

    // Remove widget(s)

    del(widgets = null) {
        // Remove all widgets
        if (widgets === null) {
            for (const widget of this.widgets) {
                widget.element.remove();
            }
            this.widgets = [];
            return true;
        }
        else {
            const w = this.widgets.filter(w => w == widgets);
            if (w.length == 0) return false;
            this.widgets = this.widgets.filter(w => w != widgets);
            return true;
        }
    }

    // Select widget

    select() {
        this.element.classList.toggle('selected', true);
        // Show on right panel
        this.panel.style.display = 'flex';
    }

    // Deselect widget

    deselect() {
        this.element.classList.toggle('selected', false);
        // Hide from right panel
        this.panel.style.display = 'none';
    }

}
