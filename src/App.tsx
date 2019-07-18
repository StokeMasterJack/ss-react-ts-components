import * as React from "react";
import {CSSProperties, Dispatch, SetStateAction, SyntheticEvent, useState} from "react";
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
import {TextField} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import {InputProps as StandardInputProps} from "@material-ui/core/Input";
import DialogActions from "@material-ui/core/DialogActions";
import Checkbox from "@material-ui/core/Checkbox";


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

    const a1: [number, Dispatch<SetStateAction<number>>] = useState<number>(1.5);
    const a2: [number, Dispatch<SetStateAction<number>>] = useState<number>(1);
    const a3: [number, Dispatch<SetStateAction<number>>] = useState<number>(20);

    const o1: [boolean, Dispatch<SetStateAction<boolean>>] = useState<boolean>(false);
    const o2: [boolean, Dispatch<SetStateAction<boolean>>] = useState<boolean>(true);
    const o3: [boolean, Dispatch<SetStateAction<boolean>>] = useState<boolean>(true);

    const onShowSettings = () => {
        o1[1](true);
    };

    // noinspection RequiredAttributes
    return (
        <ThemeProvider theme={theme}>
            <div style={{padding: 50, backgroundColor: ""}}>
                <div style={{backgroundColor: "", padding: 0, margin: 0}}>
                    <LazyScrollDemo rowHeightHead={a1[0]} rowHeightBody={a2[0]} rowCountVisible={a3[0]}
                                    showHead={o2[0]} showFoot={o3[0]} onShowSettings={onShowSettings}/>
                </div>
            </div>
            <LazyScrollSettings a1={a1} a2={a2} a3={a3} o1={o1} o2={o2} o3={o3}/>
        </ThemeProvider>
    );
};
type NN = [number, Dispatch<SetStateAction<number>>];
type BB = [boolean, Dispatch<SetStateAction<boolean>>];

const LazyScrollSettings = ({a1, a2, a3, o1, o2, o3}: { a1: NN, a2: NN, a3: NN, o1: BB, o2: BB, o3: BB }) => {

    const [rowHeightHead, setRowHeightHead] = a1;
    const [rowHeightBody, setRowHeightBody] = a2;
    const [visRows, setVisRows] = a3;
    const [open, setOpen] = o1;
    const [showHeader, setShowHeader] = o2;
    const [showFooter, setShowFooter] = o3;

    const onClose = (e: SyntheticEvent) => {
        e.preventDefault();
        setOpen(false);
    };

    function mkOnChange(setter: Dispatch<SetStateAction<number>>, defaultValue: number): React.ChangeEventHandler<HTMLInputElement> {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            const t: HTMLInputElement = e.target as HTMLInputElement;
            const s = t.value;
            if (s.trim() === "") {
                setter(0);
            } else {
                const i = parseFloat(s.trim());
                if (isNaN(i)) {
                    setter(defaultValue);
                } else if (i < 0) {
                    setter(0);
                } else {
                    setter(i);
                }
            }
        };
    }

    function mkOnBoolChange(currentValue: boolean, setter: Dispatch<SetStateAction<boolean>>): React.ChangeEventHandler<HTMLInputElement> {
        // noinspection JSUnusedLocalSymbols
        return (e: any) => {   // eslint-disable-line
            // e.preventDefault();
            setter(!currentValue);
        };
    }

    const inputStyle: CSSProperties = {
        fontSize: 14,
    };

    const tfStyle: CSSProperties = {
        margin: 10,
    };


    const inputProps: Partial<StandardInputProps> = {
        type: "number",
        style: inputStyle
    };

    return <Dialog open={open} onClose={onClose}>
        <DialogTitle>RTable Settings</DialogTitle>
        <DialogContent>
            <div style={{display: "flex", flexDirection: "column"}}>
                <div style={{display: "flex"}}>
                    <TextField value={rowHeightHead}
                               style={tfStyle}
                               variant={"outlined"}
                               label="Row height head"
                               onChange={mkOnChange(setRowHeightHead, CLazyScroll.DEFAULT_ROW_HEIGHT)}
                               InputProps={inputProps}

                    />
                    <TextField value={rowHeightBody}
                               style={tfStyle}
                               variant={"outlined"}
                               label="Row height body"
                               onChange={mkOnChange(setRowHeightBody, CLazyScroll.DEFAULT_ROW_HEIGHT)}
                               InputProps={inputProps}/>
                    <TextField value={visRows}
                               style={tfStyle}
                               variant={"outlined"}
                               label="# vis rows"
                               onChange={mkOnChange(setVisRows, CLazyScroll.DEFAULT_ROW_COUNT_VISIBLE)}
                               InputProps={inputProps}/>
                </div>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center", marginRight: "1rem"}}>
                        <Checkbox
                            checked={showHeader} onChange={mkOnBoolChange(showHeader, setShowHeader)}/> Show Header
                    </div>
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}><Checkbox
                        checked={showFooter} onChange={mkOnBoolChange(showFooter, setShowFooter)}/> Show Footer
                    </div>
                </div>
            </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary" href='close'>Close</Button>
        </DialogActions>
    </Dialog>;
};

export default App;

