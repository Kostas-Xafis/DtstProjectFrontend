import React, { FC, useEffect, useState, useContext } from 'react';
import Input from '../Inputs';
import css from './SignIn.module.css';
import { InputProps } from '../Inputs/Input';
import { FaLock, FaUser } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useFetch } from '../../hooks/useFetch';
import { Link } from 'react-router-dom';
import { AuthContext, AuthData } from '../Index';

type SignInBody = {
	username: string;
	password: string;
	email?: string;
};

type SignInProps = {
	signup: boolean;
};

type InputsArray = {
	[P in keyof SignInBody]: InputProps;
};

const SignIn: FC<SignInProps> = ({ signup }) => {
	const [postData, setPostData] = useState<Partial<SignInBody>>({});
	const [fetchData, setFetch] = useFetch<AuthData>({});
	const { setAuthData } = useContext(AuthContext);
	const inputs: InputsArray = {
		'username': {
			'htmlfor': 'username',
			'text': 'Username',
			'type': 'text',
			'placeholder': 'e.g. Jackson',
			'inputIcon': <FaUser />,
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

	if (!signup) {
		// Removing excess fields
		delete inputs.email;
		delete inputs.password.validate;
		delete inputs.password.validate_id;
		delete inputs.password.validations;
	}

	const onClick = (e: React.SyntheticEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (signup) {
			if (!(postData?.email && postData.password && postData.username)) return;
			setFetch({ 'request': { 'method': 'POST', 'path': '/api/auth/user/signup', 'body': postData } });
		} else {
			if (!(postData?.password && postData.username)) return;
			setFetch({ 'request': { 'method': 'POST', 'path': '/api/auth/signin', 'body': postData } });
		}
	};

	useEffect(() => {
		if (!fetchData.response) return;
		// Do something with errors too!
		if (fetchData.response.accessToken) {
			setAuthData(fetchData.response);
			document.getElementById('redirectLink')?.click();
		} else
			setFetch({
				// Fetch again to do a login
				'request': {
					'method': 'POST',
					'path': '/api/auth/signin',
					'body': { 'username': postData?.username, 'password': postData?.password },
				},
			});
	}, [fetchData]);

	return (
		<div id={css.form_container}>
			<form id={css.form} className={signup ? '' : css.signin}>
				{Object.values(inputs).map((data, i) => (
					<div key={i} className={css.inputRows}>
						<Input key={i} {...data} />
					</div>
				))}
				<div className={css.inputRows} id={css.submitBtnContainer}>
					<Link id="redirectLink" to={signup ? '/new_user' : '/dashboard'}>
						<button type="submit" onClick={onClick} className="submitButton">
							{signup ? 'Sign Up' : 'Log In'}
						</button>
					</Link>
				</div>
			</form>
		</div>
	);
};

export default SignIn;
