/**
 * Total Pro Menu Widget Option
 * (c) 2020-2023 Dariusz Dawidowski, All Rights Reserved.
 */

class TotalProMenuOption extends TotalProMenuWidget {

    constructor(args) {
        super(args);
        const { icon = null, text = null, shortcut, disabled, onChange = null } = args;
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
        this.render();
        this.element.addEventListener('click', () => {
            if (this.callback && !this.disabled) this.callback();
        });
    }

    setName(text) {
        this.text = text;
        this.render();
        return this;
    }

    getName() {
        return this.text;
    }

    setIcon(name) {
        this.icon = name;
        this.render();
        return this;
    }

    getIcon() {
        return this.icon;
    }

    render() {
        let html = '';
        if (this.icon) html += `<div class="menu-option-icon">${this.icon}</div>`;
        if (this.text) html += `<p class="menu-option-name">${this.text}</p><div style="flex: 1;"></div><p class="menu-option-shortcut">${this.shortcutText || ''}</p>`;
        this.element.innerHTML = html;
    }

}
