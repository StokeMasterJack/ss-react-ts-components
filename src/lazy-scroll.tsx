import * as React from "react";
import {CSSProperties, FC, useMemo, useRef} from "react";
import {Theme} from "@material-ui/core";
import makeStyles from "@material-ui/styles/makeStyles";
import {InView, RootEl, Row, SetChildRef, useIntersection} from "./intersection-observer";
import {Int} from "./util";

const useStyles = makeStyles((theme: Theme) => {
    return {
        topDiv: {
            overflowY: "scroll"
        },
        table: {
            borderCollapse: "collapse"
        },
        rowInnerDivLite: {
            display: "flex",
        },
        rowInnerTdLite: {},
        rowInnerDivHeavy: {
            display: "flex",
        },
        rowInnerTdHeavy: {
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: theme.palette.divider
        },
        rowContainer: {
            margin: 0,
            padding: 0,
            textAlign: "left"
        },

    };
});

interface RowOuter {
    component?: "div" | "tr",      //tagName: [div] or tr  - default: div
    rowHeight?: number,
    style?: CSSProperties,   //if defined then added to: {height:`${rowHeight}rem`}
    className?: string       //default: undefined
}

interface RowInner {
    heavy: RowVu,
    lite?: RowVu,
}

interface RowSpec {
    rowOuter: RowOuter;
    rowInner: RowInner;
}

export interface RowProps extends RowSpec {
    colCount?: number;
    row: Row;
    rowIndex: Int;
}

export type RowVu = FC<RowProps>;


const LiteInnerDefault: RowVu = (p: RowProps) => {
    const classes = useStyles();
    const key = p.row.id.toString();
    const {rowInner, rowOuter} = p;
    const {lite} = rowInner;

    if (!!lite) {
        const Lite: RowVu = lite;
        return <Lite {...p} />;
    }

    const effectiveOuterComponent = !!rowOuter.component ? rowOuter.component : "div";
    if (effectiveOuterComponent === "div") {
        return <div key={key} className={classes.rowInnerDivLite}>Loading...</div>;
    } else if (effectiveOuterComponent === "tr") {
        const colSpan = !!p.colCount ? p.colCount : 1;
        return <td key={key} className={classes.rowInnerTdLite} colSpan={colSpan}>Loading...</td>;
    } else {
        throw Error();
    }

};


function LazyRow(p: RowProps & { root: RootEl | null }) {
    const root = p.root;
    const [setChildRef, inView]: [SetChildRef, InView] = useIntersection({root});
    const pp = {...p, setChildRef, inView};
    delete pp.root;
    return <LazyRowVu  {...pp} />;

}

function LazyRowVu(p: RowProps & { setChildRef: any, inView: boolean }) {
    const {row, rowInner, rowOuter, setChildRef, inView} = p;
    const {heavy, lite} = rowInner;

    const Heavy = heavy;
    const Lite = !!lite ? lite : LiteInnerDefault;

    const id: number = row.id;
    const key: string = id.toString();

    const outerRowStyleDefault: CSSProperties = useMemo(() => ({height: `${rowOuter.rowHeight}rem`}), [rowOuter.rowHeight]);
    const outerRowStyleEffective = !!rowOuter.style ? {...rowOuter.style, ...outerRowStyleDefault} : outerRowStyleDefault;

    const Inner = inView ? Heavy : Lite;

    const outerTagName: string = typeof rowOuter.component === "string" ? rowOuter.component : "div";
    const outerProps = {key, ref: setChildRef, className: rowOuter.className, style: outerRowStyleEffective};

    const outerChildren = <Inner {...p} />;

    return React.createElement(
        outerTagName,
        outerProps,
        outerChildren
    );


}


const ROW_COUNT_VISIBLE_DEFAULT: Int = 10;
const ROW_HEIGHT_DEFAULT: number = 1;  //rem


interface LazyScrollProps extends RowSpec {
    colCount?: number;
    rows: readonly Row[],
    rowCountVisible?: number,
}

export const LazyScroll = (p: LazyScrollProps) => {
    const classes = useStyles();
    const rootRef = useRef<Element | null>(null);


    const rowCountVisible: Int = !!p.rowCountVisible ? p.rowCountVisible : ROW_COUNT_VISIBLE_DEFAULT;
    const rowHeight: number = !!p.rowOuter.rowHeight ? p.rowOuter.rowHeight : ROW_HEIGHT_DEFAULT;

    const parentStyle: CSSProperties = useMemo(() => ({height: `${rowCountVisible * rowHeight}rem`}), [rowCountVisible, rowHeight]);

    const setRootRef = React.useCallback((el: RootEl | null) => rootRef.current = el, [rootRef]);

    function mkRow(row: Row, rowIndex: Int): React.ReactNode {
        const key = row.id.toString();
        const root = rootRef.current;
        return <LazyRow key={key} rowInner={p.rowInner} rowOuter={p.rowOuter} root={root} row={row}
                        colCount={p.colCount}
                        rowIndex={rowIndex}/>;
    }

    if (p.rowOuter.component === "div") {
        return <div className={classes.topDiv} style={parentStyle} ref={setRootRef}>
            {p.rows.map(mkRow)}
        </div>;
    } else if (p.rowOuter.component === "tr") {
        return <div className={classes.topDiv} style={parentStyle} ref={setRootRef}>
            <table className={classes.table}>
                <tbody>
                {p.rows.map(mkRow)}
                </tbody>
            </table>
        </div>;
    } else {
        throw Error();
    }


};