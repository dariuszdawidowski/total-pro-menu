/**
 * Total Pro Menu widget Switch
 * (c) 2020-2024 Dariusz Dawidowski, All Rights Reserved.
 */

class TotalProMenuSwitch extends TotalProMenuWidget {

    constructor(params) {
        // Parameters
        super(params);
        const { text = '', value = false, onChange = null, direction = 'row'} = params;
        this.text = text;
        this.callback = onChange;
        this.value = value;

        // Controls
        this.dot = document.createElement('div');
        this.dot.classList.add('menu-switch-dot');

        this.switch = document.createElement('div');
        this.switch.classList.add('menu-switch-button');
        this.switch.classList.toggle('selected', this.value == true);
        this.switch.appendChild(this.dot);

        this.element.classList.add('menu-switch')
        if (direction == 'row') {
            this.element.innerHTML = `<p>${this.text}</p><div style="flex: 1"></div>`;
        }
        else if (direction == 'column') {
            this.element.style.flexDirection = 'column';
            this.element.innerHTML = `<p style="margin-bottom: 12px">${this.text}</p></div>`;
        }
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
    }

    set(state) {
        if (state) this.select(); else this.deselect();
    }

    get() {
        return this.value;
    }

}
