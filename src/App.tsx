import * as React from "react";
import {useEffect, useState} from "react";

import {
    CLazyScroll,
    LazyScroll,
    LazyScrollClasses,
    LazyScrollProps,
    RowContentProps,
    RowSpecBody,
    RowSpecHead,
} from "./components/lazy-scroll";

import {Emp, fetchEmps, UseEmp} from "./emp-types";
import {LazyScrollSettings, LazyScrollSettingsDialog} from "./components/lazy-scroll-settings";
import {AppClasses, mkStyles} from "./AppStyle";


const [useStyles1, useStyles2] = mkStyles();

type LazyScrollDemoProps = LazyScrollSettings & { rows_: UseEmp };
function LazyScrollDemo(p: LazyScrollDemoProps) {

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

const App: React.FC = () => {

    const rowHeightHead_ = useState<number>(CLazyScroll.DEFAULT_ROW_HEIGHT_HEAD);
    const rowHeightBody_ = useState<number>(CLazyScroll.DEFAULT_ROW_HEIGHT_BODY);
    const visRows_ = useState<number>(CLazyScroll.DEFAULT_ROW_COUNT_VISIBLE);
    const showHeader_ = useState<boolean>(true);
    const showFooter_ = useState<boolean>(true);
    const openDialog_ = useState<boolean>(false);
    const rows_ = useState<readonly Emp[]>([]);

    useEffect(() => {
        let ignore = false;

        const _fetch = async (): Promise<void> => {
            const a = await fetchEmps();
            if (!ignore) {
                rows_[1](a);
            }

        };

        // noinspection JSIgnoredPromiseFromCall
        _fetch();

        return () => {
            ignore = true;
        };
    }, []);  // eslint-disable-line

    const lazyScrollSettings: LazyScrollSettings = {
        rowHeightHead_,
        rowHeightBody_,
        visRows_,
        showHeader_,
        showFooter_,
        openDialog_
    };

    const props: LazyScrollDemoProps = {
        ...lazyScrollSettings,
        rows_
    };

    // noinspection RequiredAttributes
    return <>
        <div style={{padding: 50, backgroundColor: ""}}>
            <div style={{backgroundColor: "", padding: 0, margin: 0}}>
                <LazyScrollDemo {...props}/>
            </div>
        </div>
        <LazyScrollSettingsDialog  {...lazyScrollSettings}/>
    </>;
};

export default App;

