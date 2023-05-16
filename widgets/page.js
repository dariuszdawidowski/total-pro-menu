/**
 * Total Pro Menu widget Page
 * (c) 2020-2023 Dariusz Dawidowski, All Rights Reserved.
 */

class MenuPage extends TotalProMenuWidget {

    constructor(params) {
        super(params);

        const { title, children } = params;

        this.title = title;
        this.children = children;

        this.element.classList.add('menu_page');
        this.element.innerHTML = `<p class="menu_page_title">${this.title}</p>`;
        for (const c of this.children || []) this.element.appendChild(c.build(menu));

        return this.element;
    }

}
