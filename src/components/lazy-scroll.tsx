import * as React from "react";
import {CSSProperties, Dispatch, FC, MutableRefObject, ReactChild, SetStateAction, useRef} from "react";
import {InView, RootEl, Row, SetChildRef, useIntersection} from "./intersection-observer";
import {Int} from "./util";

export type LSClassKey =
    | "root"


    | "divHead"
    | "tableHead"
    | "trHead"
    | "th"

    | "divBody"
    | "tableBody"
    | "trBody"
    | "td"

    ;


export type LazyScrollClasses = {
    root: string,
    divBody: string,
    divHead: string,
    tableHead: string,
    tableBody: string,
    trHead: string,
    trBody: string,
    td: string,
    th: string,

}


type RowTag = "div" | "tr";

export interface RowContentProps {
    p: LazyScrollProps,
    d: RowData
}

export type RowContentHead = FC<LazyScrollProps>;
export type RowContentBody = FC<RowContentProps>;

export interface RowSpec {
    rowTag?: RowTag;      //tagName: [div] or tr  - default: div
    rowHeight?: number;
    rowStyle?: CSSProperties;   //if defined then added to: {height:`${rowHeight}rem`}
}

export interface RowSpecHead extends RowSpec {
    rowContent: RowContentHead;
    hide?: boolean;
}

export interface RowSpecBody extends RowSpec {
    rowContent: RowContentBody;
}


export interface RowData {
    row: Row;
    rowIndex: Int;
}

export interface IntersectProps {
    root: RootEl | null;
}

export interface RowProps extends RowSpec {
    colCount?: number;
    row: Row;
    rowIndex: Int;
}

export type RowVu = FC<RowProps>;


export type LazyRowProps = LazyScrollProps & IntersectProps & RowData ;

function LazyRow(p: LazyRowProps) {
    const cr = CLazyRow.mk2(p);
    const [setChildRef, inView]: [SetChildRef, InView] = useIntersection({root: p.root});
    return cr.mkRowElement(setChildRef, inView);
}


export interface LazyScrollProps {
    classes: LazyScrollClasses,
    rowSpecBody: RowSpecBody;
    rowSpecHead: RowSpecHead;
    rowSpecFoot: RowSpecHead;
    colCount?: Int;
    rowCountVisible?: number;
    rows: readonly Row[],
    onShowSettings?: VoidFunction
}

export class CLazyRow {
    rowData: RowData;
    c: CLazyScroll;


    constructor(c: CLazyScroll, rowData: RowData) {
        this.c = c;
        this.rowData = rowData;
    }

    get classes(): LazyScrollClasses {
        return this.c.classes;
    }

    get row(): Row {
        return this.rowData.row;
    }

    get colSpan(): Int {
        return this.c.colSpan;
    }

    get id(): Int {
        return this.rowData.row.id;
    }

    get key(): string {
        return this.id.toString();
    }

    get lazyScroll(): CLazyScroll {
        return this.c;
    }

    get rowTag(): RowTag {
        return this.c.rowTagBody;
    }


    get rowSpecBody(): RowSpecBody {
        return this.lazyScroll.rowSpecBody;
    }


    get rowSpecHead(): RowSpecHead {
        return this.lazyScroll.rowSpecHead;
    }

    get mkContentLite(): RowContentBody {
        // noinspection JSUnusedLocalSymbols
        return (p: RowContentProps) => {  // eslint-disable-line
            const classes = this.c.props.classes;
            const m = this;
            return <td key={m.key} className={classes.td} colSpan={m.colSpan}>Loading...</td>;
        };
    }

    static mk(p: LazyScrollProps, d: RowData): CLazyRow {
        const c = CLazyScroll.mk(p);
        return new CLazyRow(c, d);
    }

    static mk2(props: LazyRowProps): CLazyRow {
        const p: LazyScrollProps = props;
        const d: RowData = props;
        return this.mk(p, d);
    }

    mkRowPropsBody(ref: SetChildRef): { ref: SetChildRef, classes: LazyScrollClasses, style: CSSProperties } {
        const m = this;
        const c: CLazyScroll = m.c;
        const style = c.rowStyleDynBody;
        const classes = c.classes;
        return {ref, classes, style};
    }

    mkRowPropsHead(ref: SetChildRef): { ref: SetChildRef, classes: LazyScrollClasses, style: CSSProperties } {
        const m = this;
        const c: CLazyScroll = m.c;
        const style = c.rowStyleDynHead;
        const classes = c.classes;
        return {ref, classes, style};
    }

    mkRowContentBody(inView: InView): ReactChild {
        const RowContentInView: RowContentBody = this.rowSpecBody.rowContent;
        const RowContentOutView: RowContentBody = this.mkContentLite;
        const p = this.c.props;
        const d = this.rowData;
        const pp = {p, d};
        if (inView) {
            return <RowContentInView {...pp}/>;
        } else {
            return <RowContentOutView {...pp}/>;
        }
    }

    mkRowElement(setChildRef: SetChildRef, inView: InView) {
        const m = this;
        return React.createElement(
            m.rowTag,
            m.mkRowPropsBody(setChildRef),
            m.mkRowContentBody(inView)
        );
    }

}

export type UseState<T> = [T, Dispatch<SetStateAction<T>>];
export type NN = UseState<number>;
export type BB = UseState<boolean>;

export class CLazyScroll {

    static readonly DEFAULT_ROW_TAG_NAME: RowTag = "tr";
    static readonly DEFAULT_ROW_COUNT_VISIBLE: Int = 25;
    static readonly DEFAULT_ROW_HEIGHT_HEAD: number = 1.5;  //rem
    static readonly DEFAULT_ROW_HEIGHT_BODY: number = 1.2;  //rem
    static readonly DEFAULT_COL_SPAN: Int = 1;

    props: LazyScrollProps;

    constructor(props: LazyScrollProps) {
        this.props = props;
    }

    get classes(): LazyScrollClasses {
        return this.props.classes;
    }


    get rowTagBody(): RowTag {
        const c = this.props.rowSpecBody.rowTag;
        const d = CLazyScroll.DEFAULT_ROW_TAG_NAME;
        return !c ? d : c;
    }

    get rowTagHead(): RowTag {
        const c = this.props.rowSpecHead.rowTag;
        const d = CLazyScroll.DEFAULT_ROW_TAG_NAME;
        return !c ? d : c;
    }


    get rowCountVisible(): Int {
        const p = this.props;
        return !!p.rowCountVisible ? p.rowCountVisible : CLazyScroll.DEFAULT_ROW_COUNT_VISIBLE;
    }

    get rowSpecHead(): RowSpecHead {
        const p = this.props;
        return p.rowSpecHead;
    }

    get rowSpecBody(): RowSpecBody {
        const p = this.props;
        return p.rowSpecBody;
    }

    //in rems
    get rowHeightBody(): Int {
        const h = this.rowSpecBody.rowHeight;
        return !!h ? h : CLazyScroll.DEFAULT_ROW_HEIGHT_BODY;
    }

    get rowHeightHead(): Int {
        const h = this.rowSpecHead.rowHeight;
        return !!h ? h : CLazyScroll.DEFAULT_ROW_HEIGHT_HEAD;
    }

    //in rems
    get rootHeight(): number {
        return this.rowCountVisible * this.rowHeightBody;
    }

    get rootStyleDyn(): CSSProperties {
        return {height: `${this.rootHeight}rem`};
    }

    get rowStyleDynBody(): CSSProperties {
        const rowHeight: number = this.rowHeightBody;
        const rowStyleDefault: CSSProperties = ({height: `${rowHeight}rem`});
        const rowStyleProvided: CSSProperties | undefined = this.props.rowSpecBody.rowStyle;
        return !!rowStyleProvided ? {...rowStyleProvided, ...rowStyleDefault} : rowStyleDefault;
    }

    get rowStyleDynHead(): CSSProperties {
        const rowHeight: number = this.rowHeightHead;
        const rowStyleDefault: CSSProperties = ({height: `${rowHeight}rem`});
        const rowStyleProvided: CSSProperties | undefined = this.props.rowSpecHead.rowStyle;
        return !!rowStyleProvided ? {...rowStyleProvided, ...rowStyleDefault} : rowStyleDefault;
    }


    get colSpan(): Int {
        const s = this.props.colCount;
        return !!s ? s : CLazyScroll.DEFAULT_COL_SPAN;
    }

    static mk(p: LazyScrollProps): CLazyScroll {
        return new CLazyScroll(p);
    }

    mkRow(d: RowData): CLazyRow {
        return CLazyRow.mk(this.props, d);
    }

    mkRowContentBody(rowData: RowData, inView: InView): ReactChild {
        const cr = CLazyRow.mk(this.props, rowData);
        return cr.mkRowContentBody(inView);
    }

    mkRowPropsBody(ref: SetChildRef, rowData: RowData): { ref: SetChildRef, classes: LazyScrollClasses, style: CSSProperties } {
        const cr = CLazyRow.mk(this.props, rowData);
        return cr.mkRowPropsBody(ref);
    }
}

export const LazyScroll = (p: LazyScrollProps) => {
    const c: CLazyScroll = new CLazyScroll(p);
    const cc: LazyScrollClasses = p.classes;
    const rootRef: MutableRefObject<RootEl | null> = useRef<RootEl | null>(null);

    // const rowCountVisible: Int = c.rowCountVisible;
    // const rowHeight: number = c.rowHeight;
    // const rootStyleDyn: CSSProperties = useMemo(() => c.rootStyleDyn, [rowCountVisible, rowHeight]);

    const setRootRef = React.useCallback((el: RootEl | null) => rootRef.current = el, [rootRef.current]); // eslint-disable-line

    function mkRow(row: Row, rowIndex: Int): React.ReactNode {
        const root: RootEl | null = rootRef.current;
        const d: RowData = {row, rowIndex};
        const cr: CLazyRow = CLazyRow.mk(p, d);
        const pp: LazyRowProps = {...p, ...d, root};
        return <LazyRow key={cr.key} {...pp} />;
    }


    const rowSpecHead = p.rowSpecHead;
    const rowSpecFoot = p.rowSpecFoot;
    const RowContentHead = rowSpecHead.rowContent;

    const FOOTER_NON_TD = "FooterNonTd";
    const onClick = (e: React.MouseEvent) => {
        const target: any = e.nativeEvent.target;
        const dataValue = target.getAttribute("data-value");
        if (dataValue === FOOTER_NON_TD && p.onShowSettings) {
            p.onShowSettings();
        }
    };

    return <div className={cc.root} style={{padding: 0, margin: 0}}>
        <div className={cc.divHead} style={{display: rowSpecHead.hide ? "none" : ""}}>
            <table className={cc.tableHead}>
                <thead>
                <tr className={cc.trHead} style={c.rowStyleDynHead}>
                    <RowContentHead {...p} />
                </tr>
                </thead>
            </table>
        </div>
        <div className={cc.divBody} ref={setRootRef} style={c.rootStyleDyn}>
            <table className={cc.tableBody}>
                <tbody>
                {p.rows.map(mkRow)}
                </tbody>
            </table>
        </div>
        <div data-value={FOOTER_NON_TD} className={cc.divHead}
             style={{display: rowSpecFoot.hide ? "none" : "", margin: 0}}
             onMouseUpCapture={onClick}
        >
            <table className={cc.tableHead}>
                <thead>
                <tr className={cc.trHead} style={c.rowStyleDynHead}>
                    <RowContentHead {...p} />
                </tr>
                </thead>
            </table>
        </div>
    </div>;

};