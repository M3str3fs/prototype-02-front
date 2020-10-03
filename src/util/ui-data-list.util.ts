export class UiDataList<T = any> {

    private _itens: T[] = [];
    private _control: string[] = [];

    constructor(itens: T[] = [], control: string[] = []) {
        this._itens = itens;
        this._control = control;
    }

    public add = (item: T) => !this.has(item) && this._itens.push(item);

    public remove = (item: T) => this.has(item) && this._itens.splice(this._itens.indexOf(item), 1);

    public toggle = (item: T) => this.has(item) ? this.remove(item) : this.add(item);

    public has = (item: T) => {
        if (!this._control || (this._control && !this._control.length)) {
            return this._itens.some(i => i === item);
        }
        else {
            return this._itens.some((i) => {
                return this._control.map((c) => i[c] === item[c]).filter(c => c).length === this._control.length;
            });
        }
    };

    public itens = () => this._itens;

    public any = () => this._itens.length !== 0;

    public clear = () => this._itens.forEach((i) => this.remove(i));

}
