"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var grid_1 = require("./lib/grid");
var data_source_1 = require("./lib/data-source/data-source");
var helpers_1 = require("./lib/helpers");
var local_data_source_1 = require("./lib/data-source/local/local.data-source");
var Ng2SmartTableComponent = (function () {
    function Ng2SmartTableComponent() {
        this.settings = {};
        this.rowSelect = new core_1.EventEmitter();
        this.userRowSelect = new core_1.EventEmitter();
        this.delete = new core_1.EventEmitter();
        this.edit = new core_1.EventEmitter();
        this.create = new core_1.EventEmitter();
        this.deleteConfirm = new core_1.EventEmitter();
        this.editConfirm = new core_1.EventEmitter();
        this.createConfirm = new core_1.EventEmitter();
        this.defaultSettings = {
            mode: 'inline',
            selectMode: 'single',
            hideHeader: false,
            hideSubHeader: true,
            actions: {
                columnTitle: 'Actions',
                add: true,
                edit: true,
                delete: true,
                position: 'left' // left|right
            },
            filter: {
                inputClass: '',
            },
            edit: {
                inputClass: '',
                editButtonContent: 'Edit',
                saveButtonContent: 'Update',
                cancelButtonContent: 'Cancel',
                confirmSave: false
            },
            add: {
                inputClass: '',
                addButtonContent: 'Add New',
                createButtonContent: 'Create',
                cancelButtonContent: 'Cancel',
                confirmCreate: false
            },
            delete: {
                deleteButtonContent: 'Delete',
                confirmDelete: false
            },
            attr: {
                id: '',
                class: '',
            },
            noDataMessage: 'No data found',
            disableConfirmModal: false,
            columns: {},
            pager: {
                display: true,
                perPage: 10
            }
        };
        this.isAllSelected = false;
        this.selectedRow = { isInEditing: false };
        this.showConfirmCancelModal = false;
        this.disableConfirmModal = false;
    }
    Ng2SmartTableComponent.prototype.ngOnChanges = function (changes) {
        if (this.grid) {
            if (changes['settings']) {
                this.grid.setSettings(this.prepareSettings());
            }
            if (changes['source']) {
                this.grid.setSource(this.source);
            }
        }
        else {
            this.initGrid();
        }
    };
    Ng2SmartTableComponent.prototype.onAdd = function (event) {
        event.stopPropagation();
        if (this.grid.getSetting('mode') === 'external') {
            this.create.emit({
                source: this.source
            });
        }
        else {
            this.grid.createFormShown = true;
        }
        return false;
    };
    Ng2SmartTableComponent.prototype.onUserSelectRow = function (row) {
        if (this.grid.getSetting('selectMode') !== 'multi') {
            this.grid.selectRow(row);
            this._onUserSelectRow(row.getData());
            this.onSelectRow(row);
        }
    };
    Ng2SmartTableComponent.prototype._onUserSelectRow = function (data, selected) {
        if (selected === void 0) { selected = []; }
        this.userRowSelect.emit({
            data: data || null,
            source: this.source,
            selected: selected.length ? selected : this.grid.getSelectedRows(),
        });
    };
    Ng2SmartTableComponent.prototype.multipleSelectRow = function (row) {
        this.grid.multipleSelectRow(row);
        this._onUserSelectRow(row.getData());
        this._onSelectRow(row.getData());
    };
    Ng2SmartTableComponent.prototype.selectAllRows = function () {
        this.isAllSelected = !this.isAllSelected;
        this.grid.selectAllRows(this.isAllSelected);
        var selectedRows = this.grid.getSelectedRows();
        this._onUserSelectRow(selectedRows[0], selectedRows);
        this._onSelectRow(selectedRows[0]);
    };
    Ng2SmartTableComponent.prototype.onSelectRow = function (row) {
        this.grid.selectRow(row);
        this._onSelectRow(row.getData());
    };
    Ng2SmartTableComponent.prototype.onMultipleSelectRow = function (row) {
        this._onSelectRow(row.getData());
    };
    Ng2SmartTableComponent.prototype._onSelectRow = function (data) {
        this.rowSelect.emit({
            data: data || null,
            selectedRow: this.selectedRow,
            source: this.source,
        });
    };
    Ng2SmartTableComponent.prototype.onEdit = function (row, event) {
        event.stopPropagation();
        this.selectedRow = row;
        this.selectedRow.isInEditing = true;
        if (this.grid.getSetting('selectMode') === 'multi') {
            this.onMultipleSelectRow(row);
        }
        else {
            this.onSelectRow(row);
        }
        if (this.grid.getSetting('mode') === 'external') {
            this.edit.emit({
                data: row.getData(),
                source: this.source
            });
        }
        else {
            this.grid.edit(row);
        }
        if (this.disableConfirmModal) {
            row.isInEditing = false;
            this.selectedRow.isInEditing = false;
        }
        return false;
    };
    Ng2SmartTableComponent.prototype.onDelete = function (row, event) {
        event.stopPropagation();
        if (this.grid.getSetting('mode') === 'external') {
            this.delete.emit({
                data: row.getData(),
                source: this.source
            });
        }
        else {
            this.grid.delete(row, this.deleteConfirm);
        }
        return false;
    };
    Ng2SmartTableComponent.prototype.onCreate = function (row, event) {
        event.stopPropagation();
        this.grid.create(row, this.createConfirm);
        return false;
    };
    Ng2SmartTableComponent.prototype.onSave = function (row, event) {
        event.stopPropagation();
        this.grid.save(row, this.editConfirm);
        return false;
    };
    Ng2SmartTableComponent.prototype.onCancelEdit = function (row, event) {
        event.stopPropagation();
        row = row || this.selectedRow;
        row.isInEditing = false;
        this.selectedRow.isInEditing = false;
        this.showConfirmCancelModal = false;
        return false;
    };
    Ng2SmartTableComponent.prototype.initGrid = function () {
        var _this = this;
        this.source = this.prepareSource();
        this.grid = new grid_1.Grid(this.source, this.prepareSettings());
        this.grid.onSelectRow().subscribe(function (row) { return _this.onSelectRow(row); });
        this.disableConfirmModal = this.grid.getSetting('disableConfirmModal');
    };
    Ng2SmartTableComponent.prototype.prepareSource = function () {
        if (this.source instanceof data_source_1.DataSource) {
            return this.source;
        }
        else if (this.source instanceof Array) {
            return new local_data_source_1.LocalDataSource(this.source);
        }
        return new local_data_source_1.LocalDataSource();
    };
    Ng2SmartTableComponent.prototype.prepareSettings = function () {
        return helpers_1.deepExtend({}, this.defaultSettings, this.settings);
    };
    Ng2SmartTableComponent.prototype.changePage = function ($event) {
        this.resetAllSelector();
    };
    Ng2SmartTableComponent.prototype.sort = function ($event) {
        this.resetAllSelector();
    };
    Ng2SmartTableComponent.prototype.filter = function ($event) {
        this.resetAllSelector();
    };
    Ng2SmartTableComponent.prototype.resetAllSelector = function () {
        this.isAllSelected = false;
    };
    return Ng2SmartTableComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], Ng2SmartTableComponent.prototype, "source", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], Ng2SmartTableComponent.prototype, "settings", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], Ng2SmartTableComponent.prototype, "rowSelect", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], Ng2SmartTableComponent.prototype, "userRowSelect", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], Ng2SmartTableComponent.prototype, "delete", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], Ng2SmartTableComponent.prototype, "edit", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], Ng2SmartTableComponent.prototype, "create", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], Ng2SmartTableComponent.prototype, "deleteConfirm", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], Ng2SmartTableComponent.prototype, "editConfirm", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], Ng2SmartTableComponent.prototype, "createConfirm", void 0);
Ng2SmartTableComponent = __decorate([
    core_1.Component({
        selector: 'ng2-smart-table',
        templateUrl: 'ng2-smart-table.html',
        host: {
            '(document:click)': '(selectedRow.isInEditing) && !disableConfirmModal ? showConfirmCancelModal = true : null',
        }
    })
], Ng2SmartTableComponent);
exports.Ng2SmartTableComponent = Ng2SmartTableComponent;
//# sourceMappingURL=ng2-smart-table.component.js.map