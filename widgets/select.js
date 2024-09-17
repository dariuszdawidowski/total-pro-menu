/**
 * Total Pro Menu Widget Select
 * (c) 2020-2024 Dariusz Dawidowski, All Rights Reserved.
 */

class TotalProMenuSelect extends TotalProMenuWidget {

    /**
     * Constructor
     */

    constructor(args) {
        // Args
        super(args);
        const { placeholder = null, options = {}, toolbar = null, value = null, mode = 'single', side = 'bottom', onShow = null, onHide = null, onChange = null, onToolbar = null, onEdit = null} = args;

        // Callbacks
        this.onChange = onChange;
        this.onShow = onShow;
        this.onHide = onHide;

        // Setter in mode 'single' | 'multiple'
        this.mode = mode;

        // Side to display 'top' | 'bottom'
        this.side = side;

        // Main div
        this.element.classList.add('menu-select');

        // Select
        this.label = document.createElement('div');
        this.label.classList.add('menu-select-current');
        if (placeholder) this.label.title = placeholder;
        // Attach and return element
        this.element.appendChild(this.label);

        // Cloud background
        this.cloud = document.createElement('div');
        this.cloud.classList.add('menu-select-cloud');
        this.cloud.classList.add(this.side);
        this.element.appendChild(this.cloud);

        // Currently edited option
        this.edited = {
            element: null,
            value: '',
            from: '',
            to: '',
            callback: onEdit,
            clear: function() {
                this.element = null;
                this.name = '';
                this.from = '';
                this.to = '';
            }
        };

        // Bind event functions
        this.editEnterEvent = this.editEnter.bind(this);
        this.editEndEvent = this.editEnd.bind(this);

        // Options container
        this.container = document.createElement('div');
        this.cloud.appendChild(this.container);

        // Read options from args.options: {'option value': {icon: 'html', text: 'html'}}
        // Build options: {'option value': {element: <whole DOM>, icon: <DOM>, text: <DOM>, checkbox: <DOM>, selected: false}, ...}
        this.options = {};
        for (const [value, option] of Object.entries(options)) {
            this.addOption({value: value, text: option.text, icon: 'icon' in option ? option.icon : ''});
        }

        // Toolbar background
        if (toolbar != null) {
            const toolbarBg = document.createElement('div');
            toolbarBg.classList.add('menu-select-toolbar');
            this.cloud.appendChild(toolbarBg);
            for (const [name, icon] of Object.entries(toolbar)) {
                const toolbarIcon = document.createElement('div');
                toolbarIcon.classList.add('menu-select-toolbar-icon');
                toolbarIcon.dataset.name = name;
                toolbarIcon.innerHTML = icon;
                toolbarBg.append(toolbarIcon);
            }
        }

        // Current value
        if (value) this.set(value);

        // Initialize events
        this.events();

    }

    /**
     * Bind events
     */

    events() {

        // Show/hide menu event
        this.label.addEventListener('click', (event) => {
            this.toggle();
        });

        // Click on option event
        this.cloud.addEventListener('click', (event) => {
            for (const target of event.composedPath()) {

                // Span
                if (target.nodeName == 'SPAN') {

                    // Text=Option
                    if (target.hasClass('text') || target.hasClass('icon')) {
                        this.set(target.parentNode.dataset.value);
                        if (this.onChange) this.onChange(target.parentNode.dataset.value);
                        this.hide();
                        break;
                    }

                    // Checkbox
                    if (target.hasClass('checkbox')) {
                        if (target.innerText == '☐') {
                            this.select(target.parentNode.dataset.value);
                        }
                        else {
                            this.unselect(target.parentNode.dataset.value);
                        }
                    }
                    break;
                }

                // Div
                else if (target.nodeName == 'DIV') {

                    // Option
                    if (target.hasClass('menu-select-option')) {
                        this.set(target.dataset.value);
                        if (this.onChange) this.onChange(target.dataset.value);
                        this.hide();
                        break;
                    }

                    // Toolbar icon
                    else if (target.hasClass('menu-select-toolbar-icon')) {
                        onToolbar(target.dataset.name);
                        break;
                    }

                }
            }
        });

        // Global hide on show callback
        document.body.addEventListener('select:show', (event) => {
            if (event.detail != this.id) this.hide();
        });
    }

    /**
     * Add option
     *
     * args.icon: icon
     * args.text: visible text
     * args.value: return of the option
     *
     * <div class="menu-select-option"><span class="icon">..icon..</span><span class="text">..text..</span><span class="checkbox">☑</span></div>
     */

    addOption(args) {
        // Add elements to DOM
        const element = document.createElement('div');
        element.classList.add('menu-select-option');
        element.dataset.value = args.value;
        const icon = document.createElement('span');
        icon.classList.add('icon');
        icon.innerHTML = args.icon;
        element.appendChild(icon);
        const text = document.createElement('span');
        text.classList.add('text');
        element.appendChild(text);
        text.innerHTML = args.text;
        const checkbox = document.createElement('span');
        checkbox.classList.add('checkbox');
        element.appendChild(checkbox);
        if (this.mode == 'multiple') checkbox.innerHTML = '☐';
        this.container.appendChild(element);

        // Add option to list
        this.options[args.value] = {element, icon, text, checkbox, selected: false};
    }

    /**
     * Delete given options
     * ['option value', 'option value', ...]
     */

    delOptions(options) {
        for (const value of options) {
            this.options[value].element.remove();
            delete this.options[value];
        }
    }

    /**
     * Get selected options
     */

    getSelectedOptions() {
        let options = [];
        for (const [name, option] of Object.entries(this.options)) if (option.selected) options.push(name);
        return options;
    }

    /**
     * Value setter/getter
     */

    set(value) {
        for (const [name, option] of Object.entries(this.options)) {
            if (name == value) {
                this.options[name].element.classList.add('selected');
                this.options[name].selected = true;
                if (this.mode == 'multiple') this.options[name].checkbox.innerText = '☑';
            }
            else {
                this.options[name].element.classList.remove('selected');
                this.options[name].selected = false;
                if (this.mode == 'multiple') this.options[name].checkbox.innerText = '☐';
            }
        }
        this.label.innerHTML = this.options[value].text.innerHTML;
    }

    /**
     * Selection
     */

    select(value) {
        this.options[value].checkbox.innerText = '☑';
        this.options[value].element.classList.add('selected');
        this.options[value].selected = true;
        // this.value = value;
        const howmany = this.count(true);
        if (howmany == 1) this.label.innerHTML = this.options[value].text.innerHTML;
        else this.label.innerHTML = `${this.options[value].text.innerHTML} (+${howmany - 1})`;
    }

    unselect(value) {
        if (this.count(true) > 1) {
            this.options[value].checkbox.innerText = '☐';
            this.options[value].element.classList.remove('selected');
            this.options[value].selected = false;
            const howmany = this.count(true);
            if (howmany == 1) this.label.innerHTML = this.getFirstSelected().text.innerHTML;
            else this.label.innerHTML = `${this.getFirstSelected().text.innerHTML} (+${howmany - 1})`;
            // this.value = this.label.innerHTML;
        }
    }

    setFirstSelected() {
        for (const [name, option] of Object.entries(this.options)) {
            this.set(name);
            break;
        }
    }

    getFirstSelected() {
        for (const [name, option] of Object.entries(this.options)) if (option.selected) return option;
    }

    /**
     * Visibility
     */

    toggle() {
        if (this.cloud.style.display == 'block')
            this.hide();
        else
            this.show();
    }

    show() {

        // Broadast showing to close others
        const event = new CustomEvent('select:show', { detail: this.id });
        document.body.dispatchEvent(event);

        // Display
        this.cloud.style.display = 'block';

        // Compute position
        const labelBounds = this.label.getBoundingClientRect();
        const cloudBounds = this.cloud.getBoundingClientRect();
        const labelHalf = labelBounds.width / 2;
        const cloudHalf = cloudBounds.width / 2;
        const labelHeight = labelBounds.height;
        const cloudHeight = cloudBounds.height;
        this.cloud.style.left = `${-cloudHalf + labelHalf - 8}px`;
        if (this.side == 'top') this.cloud.style.top = `-${cloudHeight + labelHeight + 2}px`;
        else if (this.side == 'bottom') this.cloud.style.top = `${30}px`;


        // Enable clicking
        document.body.addEventListener('click', this.unclick.bind(this));

        // Optional callback
        if (this.onShow) this.onShow();
    }

    hide() {

        // Remove events
        document.body.removeEventListener('click', this.unclick);

        // Hide
        this.cloud.style.display = 'none';

        // Optional callback
        if (this.onHide) this.onHide();
    }

    /**
     * Clicking outer menu hides
     */

    unclick(event) {
        for (const target of event.composedPath()) {
            if (target.nodeName == 'DIV' && target.hasClass('menu-select')) return;
        }
        this.hide();
    }

    /**
     * Number of options
     */

    count(selected = null) {
        if (!selected) {
            return Object.keys(this.options).length;
        }
        else {
            let counted = 0;
            for (const [name, option] of Object.entries(this.options)) if (option.selected) counted++;
            return counted;
        }
    }

    /**
     * Inline edit option
     */

    editOption(value) {
        if (!this.edited.element) {
            this.edited.value = value;
            this.edited.from = this.options[value].text.innerHTML;
            this.edited.element = this.options[value].text;
            this.edited.element.addEventListener('keydown', this.editEnterEvent);
            this.edited.element.addEventListener('blur', this.editEndEvent);
            this.edited.element.setAttribute('contenteditable', 'true');
            this.edited.element.focus();
            document.execCommand('selectAll', false, null);
            document.getSelection().collapseToEnd();
        }
    }

    editEnter(event) {
        if (event.key == 'Enter') this.editEnd();
    }

    editEnd() {
        if (this.edited.element) {
            this.edited.to = this.options[this.edited.value].text.innerHTML;
            this.edited.element.removeEventListener('blur', this.editEndEvent);
            this.edited.element.removeEventListener('keydown', this.editEnterEvent);
            this.edited.element.setAttribute('contenteditable', 'false');
            this.edited.element.blur();
            this.edited.callback(this.edited.value, this.edited.from, this.edited.to);
            this.edited.clear();
            window.getSelection().removeAllRanges();
        }
    }

}
