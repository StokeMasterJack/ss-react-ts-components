import * as React from "react";
import {useState} from "react";
import {
    CLazyRow,
    CLazyScroll,
    LazyScroll,
    LazyScrollProps,
    LSClassKey,
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


export type ClassKey = LSClassKey
    | "id"
    | "firstName"
    | "lastName"
    | "state"

    | "idTh"
    | "firstNameTh"
    | "lastNameTh"
    | "stateTh"
    ;

const useStyles = makeStyles((theme: Theme) => {

    const td_ = {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: theme.palette.divider,
        fontSize: 12,
        fontFamily: "Roboto, Arial, sans-serif",
        color: "rgba(0, 0, 0, 0.87) !important"
    };

    const th_ = {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: theme.palette.divider,
        fontSize: 12,
        fontFamily: "Roboto, Arial, sans-serif",
        color: "rgba(0, 0, 0, 0.87) !important",
        backgroundColor: theme.palette.background.default,
        // borderBottomColor:  theme.palette.secondary.dark
    };
    return {
        root: {
            width: "100%",
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: theme.palette.secondary.dark,
            margin: 0,
            padding: 0
        },
        divHead: {
            overflowY: "scroll",
            padding: 0,
            margin: 0
        },
        divBody: {
            overflowY: "scroll",
            padding: 0,
            margin: 0
        },
        tableBody: {
            borderCollapse: "collapse",
            width: "100%",
            padding: 0,
            margin: 0
        },
        tableHead: {
            borderCollapse: "collapse",
            width: "100%",
            padding: 0,
            margin: 0
        },
        trHead: {
            backgroundColor: theme.palette.background.default,
            padding: 0,
            margin: 0
        },
        trBody: {},
        td: {
            ...td_
        },
        th: {
            ...th_
        },
        id: {
            ...td_,
            width: 60
        },
        firstName: {
            ...td_,
            width: 200
        },
        lastName: {
            ...td_,
            width: 200
        },
        state: {
            ...td_,
            width: 40
        },

        idTh: {
            ...th_,
            width: 60
        },
        firstNameTh: {
            ...th_,
            width: 200
        },
        lastNameTh: {
            ...th_,
            width: 200
        },
        stateTh: {
            ...th_,
            width: 40
        },

    };

});


const RowContentBody = ({p, d}: RowContentProps) => {
    const cr = CLazyRow.mk(p, d);
    const classes = useStyles();
    const r = cr.row as EmpFull;
    return <>
        <td className={classes.id}>{cr.key}</td>
        <td className={classes.firstName}>{r.firstName}</td>
        <td className={classes.lastName}>{r.lastName}</td>
        <td className={classes.state}>{r.state}</td>
    </>;
};

// noinspection JSUnusedLocalSymbols
const RowContentHead = (p: LazyScrollProps) => {  // eslint-disable-line
    const classes = useStyles();

    return <>
        <td className={classes.idTh}>ID</td>
        <td className={classes.firstNameTh}>First Name</td>
        <td className={classes.lastNameTh}>Last Name</td>
        <td className={classes.stateTh}>State</td>
    </>;
};

const LazyScrollDemo = ({rowHeightHead, rowHeightBody, rowCountVisible, showHead, showFoot, onShowSettings}: { rowHeightHead: number, rowHeightBody: number, rowCountVisible: number, showHead: boolean, showFoot: boolean, onShowSettings: VoidFunction }) => {
    const classes = useStyles();
    const rowSpecHead: RowSpecHead = {
        rowContent: RowContentHead,
        rowHeight: rowHeightHead,
        hide: !showHead
    };
    const rowSpecBody: RowSpecBody = {
        rowContent: RowContentBody,
        rowHeight: rowHeightBody
    };
    const rowSpecFoot: RowSpecHead = {
        rowContent: RowContentHead,
        rowHeight: rowHeightHead,
        hide: !showFoot
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
        rowCountVisible,
        onShowSettings
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

    const onShowSettings = () => {
        openDialog_[1](true);
    };


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
                    <LazyScrollDemo
                        rowHeightHead={rowHeightHead_[0]}
                        rowHeightBody={rowHeightBody_[0]}
                        rowCountVisible={visRows_[0]}
                        showHead={showHeader_[0]}
                        showFoot={showFooter_[0]}
                        onShowSettings={onShowSettings}/>
                </div>
            </div>
            <LazyScrollSettingsDialog  {...lazyScrollSettings}/>
        </ThemeProvider>
    );
};

export default App;

