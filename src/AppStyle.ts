import {CLazyScroll, LazyScrollClasses, LazyScrollStyles, LazyScrollTheme} from "./components/lazy-scroll";
import {CSSProperties} from "react";
import makeStyles from "@material-ui/styles/makeStyles/makeStyles";


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

const lazyScrollTheme: LazyScrollTheme = CLazyScroll.mkDefaultLazyScrollTheme();
const styles1: LazyScrollStyles = CLazyScroll.mkCoreStyles(lazyScrollTheme);

type P = CSSProperties;

const mkAppStyles = (t: LazyScrollTheme): AppStyles => {

    const td = styles1.td;
    // const headBoxShadowHead = "0 2px 2px -1px rgba(0, 0, 0, 0.4)";
    // const headBoxShadowFoot = "0 2px 2px 1px rgba(0, 0, 0, 0.4)";

    const th = {
        backgroundColor: t.thBackgroundColor
    };


    const idTd: P = {...td, width: 60};
    const firstNameTd: P = {...td, width: 200};
    const lastNameTd: P = {...td, width: 200};
    const stateTd: P = {...td, width: 40};

    const idTh: P = {...idTd, ...th};
    const firstNameTh: P = {...firstNameTd, ...th};
    const lastNameTh: P = {...lastNameTd, ...th};
    const stateTh: P = {...stateTd, ...th};

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
const styles2: AppStyles = mkAppStyles(lazyScrollTheme);

const useStyles1 = makeStyles((): LazyScrollStyles => styles1);
const useStyles2 = makeStyles((): AppStyles => styles2);

export const mkStyles = (): [() => LazyScrollClasses, () => AppClasses] => {
    return [useStyles1, useStyles2];
};