/**
 * Total Pro Menu widget Switch
 * (c) 2020-2023 Dariusz Dawidowski, All Rights Reserved.
 */

class TotalProMenuSwitch extends TotalProMenuWidget {

    constructor(params) {
        // Parameters
        super(params);
        const { text, value, onChange } = params;
        this.text = text || '';
        this.callback = onChange || null;
        this.value = value || false;

        // Controls
        this.dot = document.createElement('div');
        this.dot.classList.add('menu-switch-dot');

        this.switch = document.createElement('div');
        this.switch.classList.add('menu-switch-button');
        this.switch.classList.toggle('selected', this.value == true);
        this.switch.appendChild(this.dot);

        // this.element = document.createElement('div');
        this.element.classList.add('menu-switch')
        this.element.innerHTML = `<p>${this.text}</p><div style="flex: 1"></div>`;
        this.element.appendChild(this.switch);
        this.element.addEventListener('click', this.onClick.bind(this));
    }

    select() {
        this.switch.classList.toggle('selected', true);
        this.value = true;
    }

    deselect() {
        this.switch.classList.toggle('selected', false);
        this.value = false;
    }

    onClick(event) {
        if (this.value) this.deselect(); else this.select();
        if (this.callback) this.callback(this.value);
        /*if (this.callback == undefined) return this.value ? this.deselect() : this.select();
        if (this.value && this.callback(!this.value) != false) return this.deselect();
        if (!this.value && this.callback(!this.value) != false) return this.select();*/
    }

    set(state) {
        if (state) this.select(); else this.deselect();
    }

    get() {
        return this.value;
    }

}
