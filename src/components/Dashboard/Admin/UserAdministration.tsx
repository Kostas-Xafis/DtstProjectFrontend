import { useParams } from 'react-router-dom';
import Delete from './Delete';

const UserAdministration = () => {
	const id = Number(useParams().id);
	return (
		<Delete
			{...{
				text: 'Do you want to delete this account?',
				path: '/api/users/' + id,
			}}
		/>
	);
};

export default UserAdministration;
