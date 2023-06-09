class TotalProMenu{constructor(e){this.click={x:0,y:0},this.element=document.createElement("div"),this.element.id="menu",this.panel={left:new TotalProMenuPanel({id:"menu-left"}),right:new TotalProMenuPanel({id:"menu-right"})},this.element.appendChild(this.panel.left.element),this.element.appendChild(this.panel.right.element),"container"in e&&this.append(e.container),this.outclickEvent=this.outclick.bind(this),this.scrollEvent=this.scroll.bind(this)}show(e){document.body.addEventListener("pointerup",this.outclickEvent),this.element.addEventListener("wheel",this.scrollEvent);let t=this.click.x=e.left,i=this.click.y=e.top;window.scrollX+window.innerWidth-t-this.width()<0&&(t=window.scrollX+window.innerWidth-this.width()),window.scrollY+window.innerHeight-i-this.height()<0&&(i=window.scrollY+window.innerHeight-this.height()),this.element.style.left=t+"px",this.element.style.top=i+"px",this.element.style.visibility="visible"}hide(){this.element.style.visibility="hidden",document.body.removeEventListener("pointerup",this.outclickEvent),this.element.removeEventListener("wheel",this.scrollEvent)}append(e){(e||document.getElementsByTagName("body")[0]).appendChild(this.element)}visible(){return"visible"==this.element.style.visibility}position(e="menu corner"){return"first click"==e?this.click:"menu corner"==e?{x:this.element.style.left.pxToInt(),y:this.element.style.top.pxToInt()}:void 0}width(){return this.element.offsetWidth}height(){return this.element.offsetHeight}identify(e){const t=document.getElementById("menu");return!!t&&t.contains(e)}outclick(){this.visible()&&0==this.identify(event.target)&&this.hide()}scroll(e){this.element.dispatchEvent(new CustomEvent("scroll",{detail:e.wheelDeltaY}))}}
class TotalProMenuWidget{constructor(e={}){this.parent=null,this.element=document.createElement("div"),this.id="id"in e?e.id:"text"in e?"total-pro-menu-"+e.text.slug():"total-pro-menu-"+crypto.randomUUID(),this.element.id=this.id,this.widgets=[],this.disabled=!1,this.display="block"}enable(){for(const e of this.widgets||[])e.enable();return this.element.classList.remove("disabled"),this.disabled=!1,this}disable(){for(const e of this.widgets||[])e.disable();this.element.classList.add("disabled"),this.disabled=!0}select(){this.element.classList.add("selected")}deselect(){for(const e of this.widgets||[])e.deselect();this.element.classList.remove("selected")}blur(){this.deselect()}add(e){return e.parent=this,this.element.appendChild(e.element),this.widgets.push(e),e}del(e=null){if(null===e){for(const e of this.widgets)e.element.remove();this.widgets=[]}return!0}show(){this.element.style.display=this.display}hide(){this.element.style.display&&"none"!=this.element.style.display&&(this.display=this.element.style.display),this.element.style.display="none"}find(e){if(this.id==e)return this;for(const t of this.widgets||[]){const s=t.find(e);if(s)return s}return null}readOnly(e){this.element.readOnly=e}tooltip(e){this.element.title=e}}
class TotalProMenuGroup extends TotalProMenuWidget{constructor(t){super(t);const{text:e,widgets:s}=t;this.text=e,this.widgets=s,this.element.classList.add("menu-group"),this.control=document.createElement("p"),this.control.classList.add("menu-group-text"),this.control.innerText=this.text,this.element.appendChild(this.control);for(const t of this.widgets||[])this.element.appendChild(t.element)}set(t){this.control.innerText=t}get(){return this.control.innerText}}
class TotalProMenuInput extends TotalProMenuWidget{constructor(t){super(t);const{placeholder:e,value:l,filepicker:i,onFilePick:n,onChange:s}=t;this.placeholder=e||null,this.value=void 0!==l?l:null,this.filepicker=i||!1,this.onFilePick=n||null,this.onBlur=s||null,this.control=null,this.button=null,this.fileHandle,this.element.classList.add("menu-input"),this.filepicker&&(this.button=document.createElement("button"),this.button.classList.add("menu-input-button"),this.button.innerText="Open",this.button.addEventListener("click",this.onFilePick),this.element.appendChild(this.button)),this.control=document.createElement("input"),this.control.classList.add("menu-input-control"),this.placeholder&&(this.control.placeholder="-- "+this.placeholder+" --",this.control.title=this.placeholder),null!==this.value&&""!==this.value&&this.set(this.value),this.onBlur&&this.control.addEventListener("blur",this.onBlur),this.element.appendChild(this.control)}set(t){this.control.value=t}get(){return this.control?this.control.value:""}}
class TotalProMenuOption extends TotalProMenuWidget{constructor(t){super(t);const{icon:s=null,text:e=null,shortcut:i,disabled:n,onChange:h=null}=t;this.icon=s,this.text=e,this.shortcut=i,this.disabled=n,this.callback=h,null!=this.shortcut&&(this.shortcutText=this.shortcut.map((t=>16==t?"Shift":17==t?"Ctrl":18==t?"Alt":91==t||92==t?"Meta":String.fromCharCode(t))).join(" + ")),this.element.classList.add("menu-option"),this.element.classList.toggle("disabled",1==this.disabled),this.render(),this.element.addEventListener("click",(()=>{this.callback&&!this.disabled&&this.callback()}))}setName(t){return this.text=t,this.render(),this}setIcon(t){return this.icon=t,this.render(),this}render(){let t="";this.icon&&(t+=`<div class="menu-option-icon">${this.icon}</div>`),this.text&&(t+=`<p class="menu-option-name">${this.text}</p><div style="flex: 1;"></div><p class="menu-option-shortcut">${this.shortcutText||""}</p>`),this.element.innerHTML=t}}
class TotalProMenuPage extends TotalProMenuWidget{constructor(e){super(e);const{title:t,children:i}=e;this.title=t,this.children=i,this.element.classList.add("menu_page"),this.element.innerHTML=`<p class="menu_page_title">${this.title}</p>`;for(const e of this.children||[])this.element.appendChild(e.build(menu));return this.element}}
class TotalProMenuPanel extends TotalProMenuWidget{constructor(e){super(e)}}
class TotalProMenuSection extends TotalProMenuWidget{constructor(t){super(t);const{mainPage:e}=t;this.mainPage=e,this.stack=[e],this.onTouch=this.onTouch.bind(this),this.onTouchMove=this.onTouchMove.bind(this),this.onTouchEnd=this.onTouchEnd.bind(this),this.menu=t.menu,this.wrapper=document.createElement("div"),this.wrapper.classList.add("menu_section_wrapper"),this.wrapper.appendChild(this.mainPage.build(menu)),this.element.classList.add("menu_section"),this.element.appendChild(this.wrapper),this.element.addEventListener("touchstart",this.onTouch)}onTouch(t){this.stack.length<2||(this.wrapper.style.transition="none",this.wrapper.style.transform="translateX(-100%)",this.wrapper.insertBefore(this.stack[this.stack.length-1].build(this.menu),this.wrapper.firstChild),this.wrapper.insertBefore(this.stack[this.stack.length-2].build(this.menu),this.wrapper.firstChild),this.start=t.touches[0].clientX,document.addEventListener("touchmove",this.onTouchMove),document.addEventListener("touchend",this.onTouchEnd))}onTouchMove(t){this.moving=!0;const e=t.touches[0].clientX-this.start;e<0?this.wrapper.style.transform="translateX(-100%)":e>this.element.offsetWidth?this.wrapper.style.transform="translateX(0)":this.wrapper.style.transform=`translateX(calc(-100% + ${e}px))`}onTouchEnd(t){if(document.removeEventListener("touchmove",this.onTouchMove),document.removeEventListener("touchend",this.onTouchEnd),null==this.moving)return;const e=new WebKitCSSMatrix(window.getComputedStyle(this.wrapper).webkitTransform).m41;this.wrapper.style.transition="300ms ease-in-out",e/this.element.offsetWidth>-.7?(this.wrapper.style.transform="translateX(0)",this.stack.pop()):this.wrapper.style.transform="translateX(-100%)",this.wrapper.innerHTML="",this.wrapper.appendChild(this.stack[this.stack.length-1].build(this.menu)),this.moving=void 0}goTo(t){if(!this.menu)return;const e=this.stack.pop();this._showPage(e.build(this.menu),t.build(this.menu),0),this.stack.push(e),this.stack.push(t)}goBack(){if(!this.menu||this.stack.length<=1)return;const t=this.stack.pop(),e=this.stack.pop();this._showPage(e.build(this.menu),t.build(this.menu),1),this.stack.push(e)}async _showPage(t,e,s){this.wrapper.innerHTML="",this.wrapper.appendChild(t),this.wrapper.appendChild(e),this.wrapper.style.transition="none",this.wrapper.style.transform=`translateX(${0==s?"0":"-100%"})`,await delay(5),this.wrapper.style.transition="300ms ease-in-out",this.wrapper.style.transform=`translateX(${0==s?"-100%":"0"})`}}class TotalProMenuSectionPage extends TotalProMenuWidget{constructor(t){super(t);const{children:e}=t;this.children=e,this.element.classList.add("menu_section_page");for(const t of this.children)this.element.appendChild(t.build(menu))}}
class TotalProMenuSelect extends TotalProMenuWidget{constructor(e){super(e);const{placeholder:t=null,options:s={},toolbar:i=null,value:n=null,mode:o="single",side:d="bottom",onShow:l=null,onHide:h=null,onChange:c=null,onToolbar:a=null,onEdit:r=null}=e;this.onChange=c,this.onShow=l,this.onHide=h,this.mode=o,this.side=d,this.element.classList.add("menu-select"),this.label=document.createElement("div"),this.label.classList.add("menu-select-current"),t&&(this.label.title=t),this.element.appendChild(this.label),this.cloud=document.createElement("div"),this.cloud.classList.add("menu-select-cloud"),this.cloud.classList.add(this.side),this.element.appendChild(this.cloud),this.edited={element:null,value:"",from:"",to:"",callback:r,clear:function(){this.element=null,this.name="",this.from="",this.to=""}},this.editEnterEvent=this.editEnter.bind(this),this.editEndEvent=this.editEnd.bind(this),this.container=document.createElement("div"),this.cloud.appendChild(this.container),this.options={};for(const[e,t]of Object.entries(s))this.addOption({value:e,text:t.text,icon:t.icon});if(null!=i){const e=document.createElement("div");e.classList.add("menu-select-toolbar"),this.cloud.appendChild(e);for(const[t,s]of Object.entries(i)){const i=document.createElement("div");i.classList.add("menu-select-toolbar-icon"),i.dataset.name=t,i.innerHTML=s,e.append(i)}}n&&this.set(n),this.events()}events(){this.label.addEventListener("click",(e=>{this.toggle()})),this.cloud.addEventListener("click",(e=>{for(const t of e.composedPath()){if("SPAN"==t.nodeName){if(t.hasClass("text")||t.hasClass("icon")){this.set(t.parentNode.dataset.value),this.onChange&&this.onChange(t.parentNode.dataset.value),this.hide();break}t.hasClass("checkbox")&&("☐"==t.innerText?this.select(t.parentNode.dataset.value):this.unselect(t.parentNode.dataset.value));break}if("DIV"==t.nodeName){if(t.hasClass("menu-select-option")){this.set(t.dataset.value),this.onChange&&this.onChange(t.dataset.value),this.hide();break}if(t.hasClass("menu-select-toolbar-icon")){onToolbar(t.dataset.name);break}}}})),document.body.addEventListener("select:show",(e=>{e.detail!=this.id&&this.hide()}))}addOption(e){const t=document.createElement("div");t.classList.add("menu-select-option"),t.dataset.value=e.value;const s=document.createElement("span");s.classList.add("icon"),s.innerHTML=e.icon,t.appendChild(s);const i=document.createElement("span");i.classList.add("text"),t.appendChild(i),i.innerHTML=e.text;const n=document.createElement("span");n.classList.add("checkbox"),t.appendChild(n),"multiple"==this.mode&&(n.innerHTML="☐"),this.container.appendChild(t),this.options[e.value]={element:t,icon:s,text:i,checkbox:n,selected:!1}}delOptions(e){for(const t of e)this.options[t].element.remove(),delete this.options[t]}getSelectedOptions(){let e=[];for(const[t,s]of Object.entries(this.options))s.selected&&e.push(t);return e}set(e){for(const[t,s]of Object.entries(this.options))t==e?(this.options[t].element.classList.add("selected"),this.options[t].selected=!0,"multiple"==this.mode&&(this.options[t].checkbox.innerText="☑")):(this.options[t].element.classList.remove("selected"),this.options[t].selected=!1,"multiple"==this.mode&&(this.options[t].checkbox.innerText="☐"));this.label.innerHTML=this.options[e].text.innerHTML}select(e){this.options[e].checkbox.innerText="☑",this.options[e].element.classList.add("selected"),this.options[e].selected=!0;const t=this.count(!0);this.label.innerHTML=1==t?this.options[e].text.innerHTML:`${this.options[e].text.innerHTML} (+${t-1})`}unselect(e){if(this.count(!0)>1){this.options[e].checkbox.innerText="☐",this.options[e].element.classList.remove("selected"),this.options[e].selected=!1;const t=this.count(!0);this.label.innerHTML=1==t?this.getFirstSelected().text.innerHTML:`${this.getFirstSelected().text.innerHTML} (+${t-1})`}}setFirstSelected(){for(const[e,t]of Object.entries(this.options)){this.set(e);break}}getFirstSelected(){for(const[e,t]of Object.entries(this.options))if(t.selected)return t}toggle(){"block"==this.cloud.style.display?this.hide():this.show()}show(){const e=new CustomEvent("select:show",{detail:this.id});document.body.dispatchEvent(e),this.cloud.style.display="block";const t=this.label.getBoundingClientRect(),s=this.cloud.getBoundingClientRect(),i=t.width/2,n=s.width/2,o=t.height,d=s.height;this.cloud.style.left=-n+i-8+"px","top"==this.side?this.cloud.style.top=`-${d+o+2}px`:"bottom"==this.side&&(this.cloud.style.top="30px"),document.body.addEventListener("click",this.unclick.bind(this)),this.onShow&&this.onShow()}hide(){document.body.removeEventListener("click",this.unclick),this.cloud.style.display="none",this.onHide&&this.onHide()}unclick(e){for(const t of e.composedPath())if("DIV"==t.nodeName&&t.hasClass("menu-select"))return;this.hide()}count(e=null){if(e){let e=0;for(const[t,s]of Object.entries(this.options))s.selected&&e++;return e}return Object.keys(this.options).length}editOption(e){this.edited.element||(this.edited.value=e,this.edited.from=this.options[e].text.innerHTML,this.edited.element=this.options[e].text,this.edited.element.addEventListener("keydown",this.editEnterEvent),this.edited.element.addEventListener("blur",this.editEndEvent),this.edited.element.setAttribute("contenteditable","true"),this.edited.element.focus(),document.execCommand("selectAll",!1,null),document.getSelection().collapseToEnd())}editEnter(e){"Enter"==e.key&&this.editEnd()}editEnd(){this.edited.element&&(this.edited.to=this.options[this.edited.value].text.innerHTML,this.edited.element.removeEventListener("blur",this.editEndEvent),this.edited.element.removeEventListener("keydown",this.editEnterEvent),this.edited.element.setAttribute("contenteditable","false"),this.edited.element.blur(),this.edited.callback(this.edited.value,this.edited.from,this.edited.to),this.edited.clear(),window.getSelection().removeAllRanges())}}
class TotalProMenuSeparator extends TotalProMenuWidget{constructor(e){super(e),this.element.classList.add("menu-separator")}}
class TotalProSubMenu extends TotalProMenuWidget{constructor(e){super(e);const{text:t,selected:s,disabled:l,callback:i}=e;this.text=t,this.selected=s,this.disabled=l,this.callback=i,this.element.classList.add("submenu"),this.element.classList.toggle("disabled",1==this.disabled),this.element.innerHTML=`<p class="submenu-text">${this.text}</p><span>&rsaquo;</span>`,this.element.addEventListener("click",(()=>{this.disabled||(this.parent.deselect(),this.select(),this.callback&&this.callback())})),this.panel=document.createElement("div"),this.panel.classList.add("submenu-panel"),this.element.appendChild(this.panel),this.selected?this.select():this.deselect()}add(e){return this.panel.appendChild(e.element),this.widgets.push(e),e}del(e=null){if(null===e){for(const e of this.widgets)e.element.remove();return this.widgets=[],!0}return 0!=this.widgets.filter((t=>t==e)).length&&(this.widgets=this.widgets.filter((t=>t!=e)),!0)}select(){this.element.classList.toggle("selected",!0),this.panel.style.display="flex"}deselect(){this.element.classList.toggle("selected",!1),this.panel.style.display="none"}}
class TotalProMenuSwitch extends TotalProMenuWidget{constructor(t){super(t);const{text:e,value:s,onChange:i}=t;this.text=e||"",this.callback=i||null,this.value=s||!1,this.dot=document.createElement("div"),this.dot.classList.add("menu-switch-dot"),this.switch=document.createElement("div"),this.switch.classList.add("menu-switch-button"),this.switch.classList.toggle("selected",1==this.value),this.switch.appendChild(this.dot),this.element.classList.add("menu-switch"),this.element.innerHTML=`<p>${this.text}</p><div style="flex: 1"></div>`,this.element.appendChild(this.switch),this.element.addEventListener("click",this.onClick.bind(this))}select(){this.switch.classList.toggle("selected",!0),this.value=!0}deselect(){this.switch.classList.toggle("selected",!1),this.value=!1}onClick(t){this.value?this.deselect():this.select(),this.callback&&this.callback(this.value)}set(t){t?this.select():this.deselect()}get(){return this.value}}