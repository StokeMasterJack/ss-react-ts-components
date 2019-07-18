import * as React from "react";

import {LazyScrollSettings, LazyScrollSettingsDialog} from "components/lazy-scroll-settings";
import {Emp, UseEmp} from "emp-types";
import {
    LazyScroll,
    LazyScrollClasses,
    LazyScrollProps,
    RowContentProps,
    RowSpecBody,
    RowSpecHead
} from "components/lazy-scroll";
import {AppClasses, mkStyles} from "AppStyle";


export type LazyScrollDemoProps = LazyScrollSettings & { rows_: UseEmp };

const [useStyles1, useStyles2] = mkStyles();

function LazyScrollDemo1(p: LazyScrollDemoProps) {

    const c1: LazyScrollClasses = useStyles1();
    const c2: AppClasses = useStyles2();

    // noinspection JSUnusedLocalSymbols
    const RowContentBody = ({p, d}: RowContentProps) => {  // eslint-disable-line
        const r: Emp = d.row as Emp;
        return <>
            <td className={c2.idTd}>{r.id}</td>
            <td className={c2.firstNameTd}>{r.firstName}</td>
            <td className={c2.lastNameTd}>{r.lastName}</td>
            <td className={c2.stateTd}>{r.state}</td>
        </>;
    };

    // noinspection JSUnusedLocalSymbols
    const RowContentHead = (p: LazyScrollProps & { head: boolean }) => {  // eslint-disable-line
        return <>
            <td className={c2.idTh}>ID</td>
            <td className={c2.firstNameTh}>First Name</td>
            <td className={c2.lastNameTh}>Last Name</td>
            <td className={c2.stateTh}>State</td>
        </>;
    };
    const rowSpecHead: RowSpecHead = {
        rowContent: RowContentHead,
        rowHeight: p.rowHeightHead_[0],
        hide: !p.showHeader_[0]
    };
    const rowSpecFoot: RowSpecHead = {
        rowContent: RowContentHead,
        rowHeight: p.rowHeightHead_[0],
        hide: !p.showFooter_[0]
    };
    const rowSpecBody: RowSpecBody = {
        rowContent: RowContentBody,
        rowHeight: p.rowHeightBody_[0],
    };
    const colCount = 4;
    const rowCountVisible = p.visRows_[0];
    const onShowSettings = () => p.openDialog_[1](true);
    const rows = p.rows_[0];

    const lazyScrollProps: LazyScrollProps = {
        classes: c1,
        rowSpecHead,
        rowSpecFoot,
        rowSpecBody,
        colCount,
        rows,
        rowCountVisible,
        onShowSettings
    };


    return <LazyScroll {...lazyScrollProps} />;


}

export function LazyScrollDemo(p: LazyScrollDemoProps) {
    return <>
        <div style={{padding: 50, backgroundColor: ""}}>
            <div style={{backgroundColor: "", padding: 0, margin: 0}}>
                <LazyScrollDemo1 {...p}/>
            </div>
        </div>
        <LazyScrollSettingsDialog  {...p}/>
    </>;

}
