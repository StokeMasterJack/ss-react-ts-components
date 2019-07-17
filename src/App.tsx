import * as React from "react";
import {CSSProperties, useState} from "react";
import {LazyScroll, RowProps, RowVu} from "./lazy-scroll";
import createMuiTheme, {Theme} from "@material-ui/core/styles/createMuiTheme";
import {ThemeProvider} from "@material-ui/styles";
import empSampleData from "./emp-sample-data";
import {EmpFull} from "./emp-types";
import makeStyles from "@material-ui/styles/makeStyles/makeStyles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const useStyles = makeStyles((theme: Theme) => {

    const td: CSSProperties = {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: theme.palette.divider
    };

    return {
        rowDiv: {
            display: "flex",
        },
        rowTr: {},
        id: {
            ...td,
            width: 60
        },
        firstName: {
            ...td,
            width: 200
        },
        lastName: {
            ...td,
            width: 200
        },
        state: {
            ...td,
            width: 40
        },
        lite2: {
            display: "flex",
        },
        rowContainer: {
            margin: 0,
            padding: 0,
            textAlign: "left"
        },

    };
});
// const Heavy: RowVu = (p: RowVuProps) => { // eslint-disable-line
//     const key = p.row.id.toString();
//     return <span key={key}>{p.rowIndex}:{key}:Heavy</span>;
// };

const HeavyDiv: RowVu = (p: RowProps) => {
    const classes = useStyles();
    const key = p.row.id.toString();
    const r: EmpFull = p.row as EmpFull;
    return <>
        <div className={classes.id}>{key}</div>
        <div className={classes.firstName}>{r.firstName}</div>
        <div className={classes.lastName}>{r.lastName}</div>
        <div className={classes.state}>{r.state}</div>
    </>;
};

const HeavyTr: RowVu = (p: RowProps) => {  // eslint-disable-line
    const classes = useStyles();
    const key = p.row.id.toString();
    const r: EmpFull = p.row as EmpFull;
    return <>
        <td className={classes.id}>{key}</td>
        <td className={classes.firstName}>{r.firstName}</td>
        <td className={classes.lastName}>{r.lastName}</td>
        <td className={classes.state}>{r.state}</td>
    </>;
};

// noinspection JSUnusedLocalSymbols
const Lite: RowVu = (p: RowProps) => {   // eslint-disable-line
    const classes = useStyles();
    const key = p.row.id.toString();
    return <div key={key} className={classes.lite2}>Loading...</div>;
};


const LazyScrollDemo = ({div}: { div: boolean }) => {
    const classes = useStyles();
    const rowComponent = div ? "div" : "tr";
    const rowClassName = div ? classes.rowDiv : classes.rowTr;
    const Heavy = div ? HeavyDiv : HeavyTr;
    return <LazyScroll
        colCount={4}
        rows={empSampleData}
        rowCountVisible={20}
        rowOuter={{
            component: rowComponent,
            className: rowClassName,
        }}
        rowInner={{
            heavy: Heavy
        }}

    />;
};


type TabKey = "div" | "tr";

const App: React.FC = () => {

    const theme: Theme = createMuiTheme();
    const [tab, setTab] = useState<TabKey>("tr");

    return (
        <ThemeProvider theme={theme}>
            <div className="App" style={{padding: 50}}>
                <AppBar>
                    <Tabs value={tab}
                          onChange={(event: React.ChangeEvent<{}>, value: TabKey) => setTab(value)} component={'div'}>
                        <Tab value={"tr"} label="Table" href='table'/>
                        <Tab value={"div"} label="Div" href='div'/>

                    </Tabs>
                </AppBar>
                <LazyScrollDemo div={tab === "div"}/>
            </div>
        </ThemeProvider>
    );
};

export default App;

