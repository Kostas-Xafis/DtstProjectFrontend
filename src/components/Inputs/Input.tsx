import { InputInvalidMsg } from './InputInvalidMsg';
import { FC, FocusEvent } from 'react';
import { InputValidate, Nullable } from '../../utils/utils';
import css from './Input.module.css';
import { PwdEye } from './PwdEye';

export type InputProps = {
	htmlfor: string;
	text: string;
	type: string;
	placeholder?: string;
	inputIcon?: Nullable<React.ReactElement>;
	customField?: boolean;
	customFieldElem?: Nullable<React.ReactElement>;
	validate?: boolean;
	validate_id?: string;
	validations?: InputValidate[];
	setPostData?: React.Dispatch<React.SetStateAction<any>>;
};

function validateSpecific(input: string, condition: RegExp | number, txt: string): string | void {
	if (input === '') return;
	if (typeof condition === 'number') {
		// eslint-disable-next-line no-unused-expressions
		if (input.length <= condition) return txt;
	} else {
		const match = input.match(condition);
		if (!match?.length) return txt;
	}
}

export const Input: FC<InputProps> = ({
	htmlfor,
	text,
	type,
	placeholder = '',
	inputIcon = null,
	customField = false,
	customFieldElem = null,
	validate = false,
	validate_id = '',
	validations = [],
	setPostData = () => {},
}) => {
	let validateInputValues: (e: FocusEvent<HTMLElement>) => string[];

	const setData = (value: any) => {
		setPostData((prevData: any) => {
			prevData[htmlfor] = type === 'number' ? Number(value) : value;
			return { ...prevData };
		});
	};
	const onFocus = (e: FocusEvent<HTMLElement>) => {
		const curEl = (e.currentTarget as HTMLFormElement).labels[0] as HTMLElement;
		curEl.classList.add(css.expanded_outline);
	};
	const onblur = (e: FocusEvent<HTMLElement>) => {
		const curEl = e.currentTarget as HTMLFormElement;
		curEl.labels[0].classList.remove(css.expanded_outline);

		const value = curEl.value;
		if (!validate) return setData(value);

		const invalids = validateInputValues(e);
		//? Instead of using useState here i call this custom event to
		//? change the state of the child component
		document.getElementById(validate_id)?.dispatchEvent(
			new CustomEvent<string[]>('updateContent', {
				detail: invalids,
				bubbles: false,
			})
		);
		return setData(invalids.length ? '' : value);
	};

	/* 
        ! ++++++++++++++++++++++
        !    Input Validation 
        ! ++++++++++++++++++++++ 
    */
	if (validate) {
		validateInputValues = (e: FocusEvent<HTMLElement>): string[] => {
			const curEl = e.currentTarget as HTMLInputElement;
			const input = curEl.value;
			const label = curEl.labels && curEl.labels[0];
			if (!label) return [];
			const invalids: string[] = [];
			for (const cases of validations) {
				const invalidTxt = validateSpecific(input, cases.regex, cases.msg);
				if (invalidTxt) invalids.push(invalidTxt);
			}
			if (invalids.length) {
				label.style.setProperty('--validate-display', 'block');
			} else label.style.setProperty('--validate-display', 'none');
			return invalids;
		};
	}

	return (
		<>
			<div className={css.labelContainer}>
				<label
					htmlFor={htmlfor}
					className={`${css.head_txt} ${css.label_txt} ${validate ? css.inputValidate : ''}`}
				>
					{text}
					<div className={css.label_outline}></div>
				</label>

				{validate ? <InputInvalidMsg parentId={validate_id} /> : null}
			</div>
			{customField ? (
				customFieldElem
			) : (
				<div className={css.input_container}>
					<input
						autoComplete="off"
						placeholder={placeholder}
						onFocus={onFocus}
						onBlur={onblur}
						type={type}
						name={htmlfor}
						id={htmlfor}
						className={css.inputs}
					/>
					{inputIcon ? <div className={css.inputIcon}>{inputIcon}</div> : <></>}
					{type === 'password' ? <PwdEye parentId={htmlfor} /> : <></>}
				</div>
			)}
		</>
	);
};
