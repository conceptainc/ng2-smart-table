import { SimpleChange, EventEmitter, OnChanges } from '@angular/core';
import { Grid } from './lib/grid';
import { DataSource } from './lib/data-source/data-source';
import { Row } from './lib/data-set/row';
export declare class Ng2SmartTableComponent implements OnChanges {
    source: any;
    settings: Object;
    rowSelect: EventEmitter<any>;
    userRowSelect: EventEmitter<any>;
    delete: EventEmitter<any>;
    edit: EventEmitter<any>;
    create: EventEmitter<any>;
    deleteConfirm: EventEmitter<any>;
    editConfirm: EventEmitter<any>;
    createConfirm: EventEmitter<any>;
    grid: Grid;
    defaultSettings: Object;
    isAllSelected: boolean;
    selectedRow: {
        isInEditing: boolean;
    };
    showConfirmCancelModal: boolean;
    disableConfirmModal: boolean;
    ngOnChanges(changes: {
        [propertyName: string]: SimpleChange;
    }): void;
    onAdd(event: any): boolean;
    onUserSelectRow(row: Row): void;
    private _onUserSelectRow(data, selected?);
    multipleSelectRow(row: any): void;
    selectAllRows(): void;
    onSelectRow(row: Row): void;
    onMultipleSelectRow(row: Row): void;
    private _onSelectRow(data);
    onEdit(row: Row, event: any): boolean;
    onDelete(row: Row, event: any): boolean;
    onCreate(row: Row, event: any): boolean;
    onSave(row: Row, event: any): boolean;
    onCancelEdit(row: any, event: any): boolean;
    initGrid(): void;
    prepareSource(): DataSource;
    prepareSettings(): Object;
    changePage($event: any): void;
    sort($event: any): void;
    filter($event: any): void;
    private resetAllSelector();
}
