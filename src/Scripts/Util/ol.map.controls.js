/**
 * Developer    :   SongQian
 * Time         :   2019-05-30
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   OpenLayers地图功能性按钮扩展。
 */
import { Control } from 'ol/control'

export class ButtonGroupComponent extends Control {
    constructor(opts = {}) {
        let options = opts;
        let btnGroup = document.createElement("div");
        btnGroup.className = "el-button-group";
        btnGroup.setAttribute("style", "position:absolute; top: calc(20px + 80px * 0.5 - 33px * 0.5); right: 82.5px; z-index: 997;");
        if(options.buttons) {
            for(let button of options.buttons) {
                btnGroup.appendChild(button.$el);
            }
        }
        super({
            element : btnGroup,
            target : options.target
        })
    }
}

export class ImportActionButton extends Control {

    constructor(opts = {}) {
        let options = opts;
        let button = document.createElement("button");
        button.className ="el-button el-button--primary el-button--small";
        let icon = document.createElement("i");
        icon.className = "el-icon-upload2";
        button.innerText = opts.text || "";
        button.insertBefore(icon, button.childNodes[0]);
        super({
            element : button,
            target : options.target
        })

        button.addEventListener(
            "click", 
            () => { 
                if(typeof options.click === "function") {
                    options.click.apply(this, [event, this, ...arguments])
                }
            }, 
            false
        );
    }

    get $el() {
        return this.element;
    }
}

export class CustomActionButton extends Control {

    constructor(opts = {}) {
        let options = opts;
        let button = document.createElement("button");
        button.className = 'el-button el-button--default el-button--small';
        button.innerText = options.text || "";
        if(options.type) {
            button.className = button.className.replace(/(el\-button\-\-default)/g, ({ 'primary' : 'el-button--primary', 'default' : 'el-button--default'})[options.type]);
        }
        if( options.icon ) {
            let icon = document.createElement("i");
            icon.className = options.icon;
            button.insertBefore(icon, button.childNodes[0]);
        }
        super({
            element : button,
            target : options.target
        })

        button.addEventListener(
            "click", 
            () => { 
                if(typeof options.click === "function") {
                    options.click.apply(this, [event, this, ...arguments])
                }
            }, 
            false
        );
    }

    get $el() {
        return this.element;
    }
}

export class ExportActionButton extends Control {

    constructor(opts = {}) {
        let options = opts;
        let button = document.createElement("button");
        button.className ="el-button el-button--primary el-button--small";
        let icon = document.createElement("i");
        icon.className = "el-icon-download";
        button.innerText = opts.text || "";
        button.insertBefore(icon, button.childNodes[0]);
        super({
            element : button,
            target : options.target
        })

        button.addEventListener(
            "click", 
            () => { 
                if(typeof options.click === "function") {
                    options.click.apply(this, [event, this, ...arguments])
                }
            }, 
            false
        );
    }

    get $el() {
        return this.element;
    }
}

export class ListActionButton extends Control {
    constructor(opts = {}) {
        let options = opts;
        let button = document.createElement("button");
        button.className = 'el-button el-button--default el-button--small';
        if(options.type) {
            button.className = button.className.replace(/(el\-button\-\-default)/g, ({ 'primary' : 'el-button--primary', 'default' : 'el-button--default'})[options.type]);
        }
        if(options.disabled) {
            button.setAttribute("disabled", "disabled")
            button.className += ' is-disabled';
        }
        let icon = document.createElement("i");
        icon.className = options.icon;
        button.innerText = ` ${opts.text}` || " ";
        button.insertBefore(icon, button.childNodes[0]);
        super({
            element : button,
            target : options.target
        })

        button.addEventListener(
            "click", 
            () => { 
                if(typeof options.click === "function") {
                    options.click.apply(this, [event, this, ...arguments])
                }
            }, 
            false
        );
    }

    get $el() {
        return this.element;
    }
}