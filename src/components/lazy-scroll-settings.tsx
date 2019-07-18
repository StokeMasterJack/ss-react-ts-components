import *  as React from "react";
import {Dispatch, SetStateAction, SyntheticEvent} from "react";

import {InputProps} from "@material-ui/core/Input";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

import {CLazyScroll, UseState} from "./lazy-scroll";

export type N = UseState<number>;
export type B = UseState<boolean>;

export interface LazyScrollSettings {
    rowHeightHead_: N,
    rowHeightBody_: N,
    visRows_: N,
    showHeader_: B,
    showFooter_: B,
    openDialog_: B
}

export const LazyScrollSettingsDialog = ({rowHeightHead_, rowHeightBody_, visRows_, showHeader_, showFooter_, openDialog_}: LazyScrollSettings) => {

    const [rowHeightHead, setRowHeightHead] = rowHeightHead_;
    const [rowHeightBody, setRowHeightBody] = rowHeightBody_;
    const [visRows, setVisRows] = visRows_;

    const [showHeader, setShowHeader] = showHeader_;
    const [showFooter, setShowFooter] = showFooter_;

    const [open, setOpen] = openDialog_;

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

    const inputStyle: React.CSSProperties = {
        fontSize: 14,
    };

    const tfStyle: React.CSSProperties = {
        margin: 10,
    };


    const inputProps: Partial<InputProps> = {
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
                               onChange={mkOnChange(setRowHeightHead, CLazyScroll.DEFAULT_ROW_HEIGHT_HEAD)}
                               InputProps={inputProps}

                    />
                    <TextField value={rowHeightBody}
                               style={tfStyle}
                               variant={"outlined"}
                               label="Row height body"
                               onChange={mkOnChange(setRowHeightBody, CLazyScroll.DEFAULT_ROW_HEIGHT_BODY)}
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
