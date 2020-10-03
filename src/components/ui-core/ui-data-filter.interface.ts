export interface UiDataFilterStandardOption {
    label: string;
    value: any;
    checked?: boolean;
}

export interface UiDataFilterRangeOption {
    label: string;
    min: number;
    max: number;
    value?: number;
}