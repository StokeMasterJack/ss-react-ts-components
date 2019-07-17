export type Int = number;

export const ensure = <T extends {}>(value?: T | null): T => {  // eslint-disable-line
    if (value === undefined) {
        throw Error(`value must not be undefined`);
    }
    if (value === null) {
        throw Error(`value must not be null`);
    }
    return value as T;
};

// noinspection JSUnusedLocalSymbols
type Page = Int; // eslint-disable-line

export const computePageCount = (rowCountTotal: Int, rowCountVisible: Int): Int => Math.ceil(rowCountTotal / rowCountVisible);  // eslint-disable-line

/**
 *
 * @param rowIndex: 0..(rowCount - 1)
 * @param pageSize: number of rows per page
 */
// eslint-disable-line
export const computePageForRowIndex = (rowIndex: Int, pageSize: Int): Int => rowIndex < pageSize ? 0 : Math.floor(rowIndex / pageSize); // eslint-disable-line

