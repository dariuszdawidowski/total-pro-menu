/**
 * Total Pro Menu widget Section
 * (c) 2020-2023 Dariusz Dawidowski, All Rights Reserved.
 */

class MenuSection extends TotalProMenuWidget {

    constructor(params) {
        super(params);

        const { mainPage } = params;
        this.mainPage = mainPage;

        this.stack = [ mainPage ];

        this.onTouch = this.onTouch.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);

        this.menu = params.menu;

        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('menu_section_wrapper');
        this.wrapper.appendChild(this.mainPage.build(menu));

        this.element.classList.add('menu_section');     
        this.element.appendChild(this.wrapper);
        this.element.addEventListener('touchstart', this.onTouch);
    }

    onTouch(e) {
        if (this.stack.length < 2) return;

        this.wrapper.style.transition = 'none'; // Don't animate
        this.wrapper.style.transform = `translateX(-100%)`; // Start position

        // Setup pages
        this.wrapper.insertBefore(this.stack[this.stack.length - 1].build(this.menu), this.wrapper.firstChild);
        this.wrapper.insertBefore(this.stack[this.stack.length - 2].build(this.menu), this.wrapper.firstChild);

        this.start = e.touches[0].clientX;
        
        document.addEventListener('touchmove', this.onTouchMove);
        document.addEventListener('touchend', this.onTouchEnd);
    }

    onTouchMove(e) {
        this.moving = true;
        const dist = e.touches[0].clientX - this.start;

        if (dist < 0) this.wrapper.style.transform = `translateX(-100%)`;
        else if (dist > this.element.offsetWidth) this.wrapper.style.transform = `translateX(0)`;
        else this.wrapper.style.transform = `translateX(calc(-100% + ${dist}px))`;
    }

    onTouchEnd(e) {
        document.removeEventListener('touchmove', this.onTouchMove);
        document.removeEventListener('touchend', this.onTouchEnd);
        if(this.moving == undefined) return;

        const currentTranslate = new WebKitCSSMatrix(window.getComputedStyle(this.wrapper).webkitTransform).m41;

        this.wrapper.style.transition = '300ms ease-in-out'; // Animate

        if(currentTranslate / this.element.offsetWidth > -0.7) {
            this.wrapper.style.transform = `translateX(0)`; // Start position
            this.stack.pop();
        } else this.wrapper.style.transform = `translateX(-100%)`; // Start positions

        this.wrapper.innerHTML = '';
        this.wrapper.appendChild(this.stack[this.stack.length - 1].build(this.menu));

        this.moving = undefined;
    }

    goTo(page) {
        if (!this.menu) return;

        const first = this.stack.pop();

        this._showPage(first.build(this.menu), page.build(this.menu), 0);

        this.stack.push(first);
        this.stack.push(page);
    }

    goBack() {
        if (!this.menu || this.stack.length <= 1) return;

        const second = this.stack.pop();
        const first = this.stack.pop();

        this._showPage(first.build(this.menu), second.build(this.menu), 1);

        this.stack.push(first);
    }

    async _showPage(first, second, dir) {
        this.wrapper.innerHTML = ''; // Empty
        this.wrapper.appendChild(first);
        this.wrapper.appendChild(second);

        this.wrapper.style.transition = 'none'; // Don't animate
        this.wrapper.style.transform = `translateX(${dir == 0 ? '0' : '-100%'})`; // Start position
        await delay(5);

        this.wrapper.style.transition = '300ms ease-in-out'; // Animate
        this.wrapper.style.transform = `translateX(${dir == 0 ? '-100%' : '0'})`; // Slide
    }

}

//delay = ms => new Promise((resolve) => setTimeout(() => resolve(), ms));

/**
 * Section page widget
 */

class MenuSectionPage extends TotalProMenuWidget {

    constructor(params) {
        super(params);

        const { children } = params;
        this.children = children;

        this.element.classList.add('menu_section_page');
        
        for (const c of this.children) this.element.appendChild(c.build(menu));

    }

}
