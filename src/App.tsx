import * as React from "react";
import {useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";

import {
    CLazyRow,
    CLazyScroll,
    LazyScroll,
    LazyScrollProps,
    RowContentProps,
    RowSpecBody,
    RowSpecHead
} from "./components/lazy-scroll";
import {EmpFull} from "./emp-types";

import {LazyScrollSettings, LazyScrollSettingsDialog} from "./components/lazy-scroll-settings";
import {AppClasses, mkStyles} from "./AppStyle";


const [useStyles1, useStyles2] = mkStyles();


const RowContentBody = ({p, d}: RowContentProps) => {
    const cr = CLazyRow.mk(p, d);
    const c2: AppClasses = useStyles2();

    const r: EmpFull = cr.row as EmpFull;
    return <>
        <td className={c2.idTd}>{cr.key}</td>
        <td className={c2.firstNameTd}>{r.firstName}</td>
        <td className={c2.lastNameTd}>{r.lastName}</td>
        <td className={c2.stateTd}>{r.state}</td>
    </>;
};

// noinspection JSUnusedLocalSymbols
const RowContentHead = (p: LazyScrollProps & { head: boolean }) => {  // eslint-disable-line
    const c2: AppClasses = useStyles2();
    return <>
        <td className={c2.idTh}>ID</td>
        <td className={c2.firstNameTh}>First Name</td>
        <td className={c2.lastNameTh}>Last Name</td>
        <td className={c2.stateTh}>State</td>
    </>;
};


const fetchEmps = async (): Promise<readonly  EmpFull[]> => {
    const r: AxiosResponse<readonly EmpFull[]> = await axios.request<readonly EmpFull[]>({
        method: "get",
        url: "/emps.json"
    });
    return r.data;
};

const LazyScrollDemo = (s: LazyScrollSettings) => {

    const [rows, setRows] = useState<readonly EmpFull[]>([]);

    const c1 = useStyles1();
    const rowSpecHead: RowSpecHead = {
        rowContent: RowContentHead,
        rowHeight: s.rowHeightHead_[0],
        hide: !s.showHeader_[0]
    };
    const rowSpecBody: RowSpecBody = {
        rowContent: RowContentBody,
        rowHeight: s.rowHeightBody_[0],
    };
    const rowSpecFoot: RowSpecHead = {
        rowContent: RowContentHead,
        rowHeight: s.rowHeightHead_[0],
        hide: !s.showFooter_[0]
    };

    const colCount = 4;
    const ppp: LazyScrollProps = {
        classes: c1,
        rowSpecHead,
        rowSpecFoot,
        rowSpecBody,
        colCount,
        rows,
        rowCountVisible: s.visRows_[0],
        onShowSettings: () => s.openDialog_[1](true)
    };


    useEffect(() => {
        let ignore = false;

        const _fetch = async (): Promise<void> => {
            const a = await fetchEmps();
            if (!ignore) {
                setRows(a);
            }

        };

        // noinspection JSIgnoredPromiseFromCall
        _fetch();

        return () => {
            ignore = true;
        };
    }, []);

    return <LazyScroll {...ppp} />;


};


const App: React.FC = () => {


    const rowHeightHead_ = useState<number>(CLazyScroll.DEFAULT_ROW_HEIGHT_HEAD);
    const rowHeightBody_ = useState<number>(CLazyScroll.DEFAULT_ROW_HEIGHT_BODY);
    const visRows_ = useState<number>(CLazyScroll.DEFAULT_ROW_COUNT_VISIBLE);

    const showHeader_ = useState<boolean>(true);
    const showFooter_ = useState<boolean>(true);
    const openDialog_ = useState<boolean>(false);


    const lazyScrollSettings: LazyScrollSettings = {
        rowHeightHead_,
        rowHeightBody_,
        visRows_,
        showHeader_,
        showFooter_,
        openDialog_
    };

    // noinspection RequiredAttributes
    return <>
        <div style={{padding: 50, backgroundColor: ""}}>
            <div style={{backgroundColor: "", padding: 0, margin: 0}}>
                <LazyScrollDemo {...lazyScrollSettings}/>
            </div>
        </div>
        <LazyScrollSettingsDialog  {...lazyScrollSettings}/>
    </>;
};

export default App;

