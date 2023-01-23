import React, { useState, useEffect, useContext } from 'react';
import { Input, InputProps } from '../../Inputs/Input';
import { MdEmail } from 'react-icons/md';
import css from './Settings.module.css';
import { useFetch } from '../../../hooks/useFetch';
import { AuthContext } from '../../Index';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser } from 'react-icons/fa';
import { isObjectEmpty } from '../../../utils/utils';

type UserForm = { [Property in keyof User]?: User[Property] };

type InputsArray = { [Property in keyof User]?: InputProps };

const Settings = () => {
	const [inputOnce, setInputsOnce] = useState<boolean>(false);
	const [postData, setPostData] = useState<UserForm>({});
	const [fetchData, setFetch] = useFetch({});
	const { authUser, setAuthData, setAuthUser } = useContext(AuthContext);
	const navigate = useNavigate();
	const inputs: InputsArray = {
		'username': {
			'htmlfor': 'username',
			'text': 'Username',
			'type': 'text',
			'placeholder': 'e.g. Jackson',
			'inputIcon': <FaUser />,
			setPostData,
		},
		'firstname': {
			htmlfor: 'firstname',
			text: 'Firstname',
			type: 'text',
			placeholder: 'e.g. Jackson',
			inputIcon: <FaUser />,
			setPostData,
		},
		'lastname': {
			htmlfor: 'lastname',
			text: 'Lastname',
			type: 'text',
			placeholder: 'e.g. Franklin',
			inputIcon: <FaUser />,
			setPostData,
		},
		'password': {
			'htmlfor': 'password',
			'text': 'Password',
			'type': 'password',
			'placeholder': '•••••••••',
			'inputIcon': <FaLock />,
			'validate': true,
			'validate_id': 'pwdValidate',
			'validations': [
				{ regex: 7, msg: '7 or more characters' },
				{ regex: /[^\w\n ]|(_)/g, msg: '1 special character' },
				{ regex: /[A-Z]/g, msg: '1 upper case character' },
				{ regex: /[a-z]/g, msg: '1 lower case character' },
			],
			setPostData,
		},
		'email': {
			'htmlfor': 'email',
			'text': 'Email:',
			'type': 'text',
			'placeholder': 'anthony@mail.gov',
			'inputIcon': <MdEmail />,
			'validate_id': 'emailValidate',
			'validate': true,
			'validations': [{ regex: /\w+@[a-zA-Z]+[.][\w]{2,3}/g, msg: 'Invalid mail' }],
			setPostData,
		},
	};

	const onClickUpdateAccount = (e: React.SyntheticEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!postData.firstname && !postData.lastname && !postData.email && !postData.password && !postData.username) {
			return;
		}
		setFetch({
			'request': {
				'method': 'POST',
				'path': '/api/users/update',
				'body': { ...postData },
			},
		});
	};

	const onClickDeleteAccount = (e: React.SyntheticEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setFetch({
			'request': { 'method': 'DELETE', 'path': '/api/users/' + authUser.id },
		});
	};

	useEffect(() => {
		if (!isObjectEmpty(authUser) && !inputOnce) {
			document.querySelectorAll<HTMLInputElement>(`#${css.add_property_form} input`).forEach((el) => {
				const name = el.name as keyof UserForm;
				if (name !== 'password') el.value = '' + authUser[name];
			});
			setInputsOnce(true);
			return;
		}
		if (fetchData.response) {
			setAuthData({});
			setAuthUser({});
			navigate('/');
		}
	}, [authUser, fetchData.response]);

	return (
		<form id={css.add_property_form}>
			{Object.values(inputs).map((inp, i) => (
				<div className={css.input_container} key={i}>
					<Input {...inp} key={i} />
				</div>
			))}
			<div id={css.actionButtons} className={css.input_container}>
				<button onClick={onClickUpdateAccount} type="submit">
					<p>Update Account</p>
				</button>
				<button onClick={onClickDeleteAccount} type="submit">
					<p>Delete Account</p>
				</button>
			</div>
		</form>
	);
};

export default Settings;
