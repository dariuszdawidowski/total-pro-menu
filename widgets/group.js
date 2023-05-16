/**
 * Total Pro Menu widget Group
 * (c) 2020-2023 Dariusz Dawidowski, All Rights Reserved.
 */

class MenuGroup extends TotalProMenuWidget {

    constructor(params) {
        super(params);

        const { text, widgets } = params;

        this.text = text;
        this.widgets = widgets;
        // Main element
        this.element.classList.add('menu-group');
        this.control = document.createElement('p');
        this.control.classList.add('menu-group-text');
        this.control.innerText = this.text;
        this.element.appendChild(this.control);

        for (const widget of this.widgets || []) this.element.appendChild(widget.element);
    }

    set(text) {
        this.control.innerText = text;
    }

    get() {
        return this.control.innerText;
    }

}
