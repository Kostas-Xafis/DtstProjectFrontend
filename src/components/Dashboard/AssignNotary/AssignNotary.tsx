import { useEffect, useState } from 'react';
import { MdEmail } from 'react-icons/md';
import { useLocation, useParams } from 'react-router-dom';
import { useFetch } from '../../../hooks/useFetch';
import { locationCheck } from '../../../utils/utils';
import { Input, InputProps } from '../../Inputs/Input';
import css from './AssignNotary.module.css';

const AssignNotary = () => {
	const tax_id = Number(useParams().id);
	const [fetchData, setFetchRequest] = useFetch({});
	const [postData, setPostData] = useState<{ email?: string }>({});
	const isBuyer = locationCheck(useLocation(), ['/dashboard/properties'], true);
	const input: InputProps = {
		'htmlfor': 'email',
		'text': 'Email:',
		'type': 'text',
		'placeholder': 'e.g. anthony@mail.gov',
		'inputIcon': <MdEmail />,
		'validate_id': 'emailValidate',
		'validate': true,
		'validations': [{ regex: /\w+@[a-zA-Z]+[.][\w]{2,3}/g, msg: 'Invalid mail' }],
		setPostData,
	};

	const onClickAssign = (e: React.SyntheticEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!postData.email) return;
		setFetchRequest({
			'request': {
				'method': 'POST',
				'path': '/api/tax_declaration/assign_notary',
				'body': { 'tax_declaration_id': tax_id, 'notary_email': postData.email },
			},
		});
	};

	useEffect(() => {
		if (fetchData.response) history.back();
	}, [fetchData.response]);

	return (
		<div id={css.assign_notary}>
			{isBuyer ? (
				<p>
					Before continuing the purchase process you'll need to assign a <span>notary</span> to handle
					taxation:
				</p>
			) : (
				<p>
					Please assign a <span>notary</span> to handle the taxation process:
				</p>
			)}
			<div>
				<Input {...input} />
			</div>
			<button onClick={onClickAssign} type="submit">
				Assign Notary
			</button>
		</div>
	);
};

export default AssignNotary;
