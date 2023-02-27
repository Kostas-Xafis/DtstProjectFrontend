import { SyntheticEvent } from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '../../../hooks/useFetch';
import css from './Admin.module.css';

const Delete = ({ text, path, btnText }: { text: string; path: string; btnText?: string }) => {
	const id = Number(useParams().id);
	const [fetchData, setFetch] = useFetch({});

	const onClick = (e: SyntheticEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!id) return;
		setFetch({ 'request': { 'method': 'DELETE', path } });
	};
	if (fetchData.response) history.back();

	return (
		<div id={css.admin_actions}>
			<p>{text}</p>
			<button onClick={onClick} type="button">
				{btnText || 'Delete'}
			</button>
		</div>
	);
};

export default Delete;
