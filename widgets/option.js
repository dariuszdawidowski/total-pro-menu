/**
 * Total Pro Menu Widget Option
 * (c) 2020-2024 Dariusz Dawidowski, All Rights Reserved.
 */

class TotalProMenuOption extends TotalProMenuWidget {

    constructor(args) {
        super(args);
        const { icon = null, text = null, value = null, shortcut, disabled, onChange = null } = args;
        this.icon = icon;
        this.text = text;
        this.shortcut = shortcut;
        this.disabled = disabled;
        this.callback = onChange;
        if (this.shortcut != undefined) {
            // macOS
            if (navigator.platform.toUpperCase().indexOf('MAC') >= 0) {
                this.shortcutText = this.shortcut.map(k => {
                    if (k == 16) return '⇧'; // Shift
                    if (k == 17) return '⌘'; // Cmd (replace Ctrl)
                    if (k == 18) return '⌥'; // Option (Alt)
                    return String.fromCharCode(k);
                }).join(' ');
            }
            // PC
            else {
                this.shortcutText = this.shortcut.map(k => {
                    if (k == 16) return 'Shift';
                    if (k == 17) return 'Ctrl';
                    if (k == 18) return 'Alt';
                    if (k == 91 || k == 92) return 'Meta';
                    return String.fromCharCode(k);
                }).join(' + ');
            }
        }

        this.element.classList.add('menu-option');
        this.element.classList.toggle('disabled', this.disabled == true);
        this.update();
        this.element.addEventListener('click', () => {
            if (this.callback && !this.disabled) this.callback(value);
        });
    }

    setName(text) {
        this.text = text;
        this.update();
        return this;
    }

    getName() {
        return this.text;
    }

    setIcon(name) {
        this.icon = name;
        this.update();
        return this;
    }

    getIcon() {
        return this.icon;
    }

    update() {
        let html = '';
        if (this.icon) html += `<div class="menu-option-icon">${typeof(this.icon) == 'function' ? this.icon() : this.icon}</div>`;
        if (this.text) html += `<p class="menu-option-name">${typeof(this.text) == 'function' ? this.text() : this.text}</p><div style="flex: 1;"></div><p class="menu-option-shortcut">${this.shortcutText || ''}</p>`;
        this.element.innerHTML = html;
    }

}
