/**
 * Total Pro Menu widget Input
 * (c) 2020-2023 Dariusz Dawidowski, All Rights Reserved.
 */

class MenuInput extends TotalProMenuWidget {

    constructor(params) {
        // Parameters
        super(params);
        const { placeholder, value, filepicker, onFilePick, onChange } = params;
        this.placeholder = placeholder || null;
        this.value = (value !== undefined) ? value : null;
        this.filepicker = filepicker || false;
        this.onFilePick = onFilePick || null;
        this.onBlur = onChange || null;

        // Controls
        this.control = null;
        this.button = null;

        // File handler
        this.fileHandle;

        // Main div
        this.element.classList.add('menu-input');

        // Filepicker button
        if (this.filepicker) {
            this.button = document.createElement('button');
            this.button.classList.add('menu-input-button');
            this.button.innerText = 'Open';
            this.button.addEventListener('click', this.onFilePick);
            this.element.appendChild(this.button);
        }

        // Input
        this.control = document.createElement('input');
        this.control.classList.add('menu-input-control');
        if (this.placeholder) {
            this.control.placeholder = '-- ' + this.placeholder + ' --';
            this.control.title = this.placeholder;
        }
        if (this.value !== null && this.value !== '') this.set(this.value);

        // Blur
        if (this.onBlur) {
            this.control.addEventListener('blur', this.onBlur);
        }

        // Attach and return element
        this.element.appendChild(this.control);
    }

    set(text) {
        this.control.value = text;
    }

    get() {
        return this.control ? this.control.value: '';
    }

}
