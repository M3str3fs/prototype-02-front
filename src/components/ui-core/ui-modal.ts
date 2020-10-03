
export class UiModal {

    constructor(
        private el: HTMLElement
    ) { }

    public show = () => show(this.el);
    public hide = () => hide(this.el);

}

export function show(el: HTMLElement) {
    el.style.display = 'initial';
    setTimeout(() => el.classList.add('show'), 0);
}

export function hide(el: HTMLElement) {
    el.classList.remove('show');
    setTimeout(() => el.style.display = 'none', 500);
}