import { Location } from 'react-router-dom';

export type Nullable<T> = T | null | undefined;

export type InputValidate = {
	regex: RegExp | number;
	msg: string;
};

export const isObjectEmpty = (obj: object | undefined): boolean => {
	for (const a in obj) return false;
	return true;
};

export const sleep = async (ms: number) => await new Promise((rs, rj) => setTimeout(rs, ms));

export const getLCaseTag = (el: HTMLElement) => el.tagName.toLowerCase();
export const getAttr = (el: HTMLElement, attr: string) => el.getAttribute(attr);

export const locationCheck = (location: Location, paths: string[], includes = false): boolean => {
	for (const path of paths) {
		if (includes) {
			if (location.pathname.includes(path)) return true;
		} else if (location.pathname === path) return true;
	}
	return false;
};
