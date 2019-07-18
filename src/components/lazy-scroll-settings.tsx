import *  as React from "react";
import {Dispatch, SetStateAction, SyntheticEvent} from "react";

import {InputProps as StandardInputProps} from "@material-ui/core/Input";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

import {CLazyScroll} from "./lazy-scroll";
import {UseBool, UseNum} from "./util";


export interface LazyScrollSettings {
    rowHeightHead_: UseNum,
    rowHeightBody_: UseNum,
    visRows_: UseNum,
    showHeader_: UseBool,
    showFooter_: UseBool,
    openDialog_: UseBool
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

    const _InputStyle: React.CSSProperties = {
        fontSize: 12
    };

    const _inputStyle: React.CSSProperties = {
        // paddingLeft: '.2rem',
        paddingTop: ".6rem",
        paddingBottom: ".4rem",
        paddingLeft: ".4rem",
        paddingRight: ".2rem",
    };


    const tfStyle: React.CSSProperties = {
        margin: 10,
    };


    const _InputProps: Partial<StandardInputProps> = {
        type: "number",
        style: _InputStyle,
        inputProps: {
            style: _inputStyle
        }
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
                               InputProps={_InputProps}

                    />
                    <TextField value={rowHeightBody}
                               style={tfStyle}
                               variant={"outlined"}
                               label="Row height body"
                               onChange={mkOnChange(setRowHeightBody, CLazyScroll.DEFAULT_ROW_HEIGHT_BODY)}
                               InputProps={_InputProps}
                    />
                    <TextField value={visRows}
                               style={tfStyle}
                               variant={"outlined"}
                               label="# Visible rows"
                               onChange={mkOnChange(setVisRows, CLazyScroll.DEFAULT_ROW_COUNT_VISIBLE)}
                               InputProps={_InputProps}
                    />
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
