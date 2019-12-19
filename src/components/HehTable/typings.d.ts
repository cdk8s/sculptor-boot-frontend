import { ColumnProps, TableProps } from 'antd/lib/table/interface';
import { Omit } from '@/../typings';

export interface IProps<T> extends Omit<TableProps<any>, 'columns'> {
    adaptation?: any
    tableOptions?: object
    selectedRowKeys?: string[] | number[]
    // columns: ColumnProps<T>[]
    columns: any
    selectType?: 'checkbox' | 'radio'
    data: {
        currentPage: number
        list: any[]
        total: number
    } | undefined,

    pageChange?(current: number | undefined, size: number | undefined): void | undefined

    getSelectedRowKeys?: (selectedRowKeys: string[] | number[], selectedRows: T[]) => void;
}
