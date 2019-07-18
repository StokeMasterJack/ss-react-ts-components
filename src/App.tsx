import * as React from "react";
import {CSSProperties, useState} from "react";
import {
    CLazyRow,
    CLazyScroll,
    LazyScroll,
    LazyScrollProps,
    LazyScrollStyles,
    LazyScrollTheme,
    RowContentProps,
    RowSpecBody,
    RowSpecHead
} from "./components/lazy-scroll";
import createMuiTheme, {Theme} from "@material-ui/core/styles/createMuiTheme";

import empSampleData from "./emp-sample-data";
import {EmpFull} from "./emp-types";
import makeStyles from "@material-ui/styles/makeStyles";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import {LazyScrollSettings, LazyScrollSettingsDialog} from "./components/lazy-scroll-settings";

export type ClassKey =
    | "id"
    | "firstName"
    | "lastName"
    | "state"

    | "idTh"
    | "firstNameTh"
    | "lastNameTh"
    | "stateTh"
    ;


interface AppStyles {

    idTd: any;
    firstNameTd: any;
    lastNameTd: any;
    stateTd: any;


    idTh: any;
    firstNameTh: any;
    lastNameTh: any;
    stateTh: any;

}

export type AppClasses = {
    idTd: string;
    firstNameTd: string;
    lastNameTd: string;
    stateTd: string;


    idTh: string;
    firstNameTh: string;
    lastNameTh: string;
    stateTh: string;

}

const theme: LazyScrollTheme = CLazyScroll.mkDefaultLazyScrollTheme();
const styles1: LazyScrollStyles = CLazyScroll.mkCoreStyles(theme);
const mkAppStyles = (t: LazyScrollTheme): AppStyles => {

    const td = styles1.td;
    // const headBoxShadowHead = "0 2px 2px -1px rgba(0, 0, 0, 0.4)";
    // const headBoxShadowFoot = "0 2px 2px 1px rgba(0, 0, 0, 0.4)";

    const th = {
        backgroundColor: t.thBackgroundColor
    };


    const idTd = {...td, width: 60};
    const firstNameTd = {...td, width: 200};
    const lastNameTd = {...td, width: 200};
    const stateTd = {...td, width: 40};

    const idTh = {...idTd, ...th};
    const firstNameTh = {...firstNameTd, ...th};
    const lastNameTh = {...lastNameTd, ...th};
    const stateTh = {...stateTd, ...th};

    return {

        idTd,
        firstNameTd,
        lastNameTd,
        stateTd,


        idTh,
        firstNameTh,
        lastNameTh,
        stateTh,

    };

};
const styles2: AppStyles = mkAppStyles(theme);


const useStyles1 = makeStyles((): LazyScrollStyles => styles1);
const useStyles2 = makeStyles((): AppStyles => styles2);

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


    const sHead: CSSProperties = {
        borderBottomWidth: 0,
        borderBottomStyle: "none",
    };

    const sFoot: CSSProperties = {
        borderTopWidth: 0,
        borderTopStyle: "none",
    };

    const s = p.head ? sHead : sFoot;

    return <>
        <td className={c2.idTh} style={s}>ID</td>
        <td className={c2.firstNameTh} style={s}>First Name</td>
        <td className={c2.lastNameTh} style={s}>Last Name</td>
        <td className={c2.stateTh} style={s}>State</td>
    </>;
};


const LazyScrollDemo = (s: LazyScrollSettings) => {
    const classes = useStyles1();
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
    const rows = empSampleData;
    const ppp: LazyScrollProps = {
        classes,
        rowSpecHead,
        rowSpecFoot,
        rowSpecBody,
        colCount,
        rows,
        rowCountVisible: s.visRows_[0],
        onShowSettings: () => s.openDialog_[1](true)
    };

    return <LazyScroll {...ppp} />;


};


const App: React.FC = () => {

    const theme: Theme = createMuiTheme();  // eslint-disable-line

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
    return (
        <ThemeProvider theme={theme}>
            <div style={{padding: 50, backgroundColor: ""}}>
                <div style={{backgroundColor: "", padding: 0, margin: 0}}>
                    <LazyScrollDemo {...lazyScrollSettings}/>
                </div>
            </div>
            <LazyScrollSettingsDialog  {...lazyScrollSettings}/>
        </ThemeProvider>
    );
};

export default App;

