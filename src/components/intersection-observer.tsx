import * as React from "react";
import {useRef, useState} from "react";

export type RootEl = Element;
export type ChildEl = Element;
export type InView = boolean;


export type SetChildRef = (childEl: ChildEl | null) => void;
type SetInView = (inView: InView) => void;
const rootMap = new Map<RootEl | null, IntersectionObserver>();
const childMap = new Map<ChildEl, SetInView>();

export interface Row {
    id: number;
}

const onEntry = (entry: IntersectionObserverEntry) => {
    const childEl: ChildEl = entry.target;
    const setter: SetInView | undefined = childMap.get(childEl);
    if (!!setter && entry.isIntersecting) {
        setter(true);
    }
};

// noinspection JSUnusedLocalSymbols
const onIntersectionChange = (entries: IntersectionObserverEntry[], cbObserver: IntersectionObserver) => { // eslint-disable-line
    entries.forEach(onEntry);
};

const getObserverForRoot = (root: RootEl | null): IntersectionObserver => {
    let o: IntersectionObserver | undefined = rootMap.get(root);
    if (!o) {
        const options: IntersectionObserverInit = {
            root,
            threshold:0.0
        };
        o = new IntersectionObserver(onIntersectionChange, options);
        rootMap.set(root, o);
    }
    return o;
};

export const useIntersection = ({root}: { root: RootEl | null }): [SetChildRef, InView] => {
    const childRef = useRef<Element | null>();
    const [inView, setInView] = useState<InView>(false);

    const observer: IntersectionObserver = getObserverForRoot(root);

    const setChildRef: SetChildRef = React.useCallback((childEl: ChildEl | null) => {
        if (!!childRef.current) {
            childMap.delete(childRef.current);
            observer.unobserve(childRef.current);
        }

        if (!!childEl) {
            childMap.set(childEl, setInView);
            observer.observe(childEl);
        }

        childRef.current = childEl;
    }, [childRef, observer]);

    return [setChildRef, inView];

};

