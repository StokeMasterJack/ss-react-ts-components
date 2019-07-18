import * as React from "react";
import {useEffect, useState} from "react";

import {CLazyScroll,} from "components/lazy-scroll";

import {Emp, fetchEmps} from "emp-types";
import {LazyScrollSettings} from "components/lazy-scroll-settings";
import {LazyScrollDemo, LazyScrollDemoProps} from "LazyScrollDemo";


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


    return <LazyScrollDemo {...props}/>;

};

export default App;

