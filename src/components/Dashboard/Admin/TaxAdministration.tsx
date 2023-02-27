import { useParams } from 'react-router-dom';
import Delete from './Delete';

const TaxAdministration = () => {
	const id = Number(useParams().id);

	return (
		<Delete
			{...{
				text: 'Do you want to reset this tax declaration?',
				path: '/api/tax_declaration/reset/' + id,
				btnText: 'Reset',
			}}
		/>
	);
};

export default TaxAdministration;
