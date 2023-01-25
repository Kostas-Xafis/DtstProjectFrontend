import React from 'react';
import { useParams } from 'react-router-dom';
import Delete from './Delete';

const PropertyAdministration = () => {
	const id = Number(useParams().id);
	return (
		<Delete
			{...{
				text: 'Do you want to delete this property?',
				path: '/api/real_estate/' + id,
			}}
		/>
	);
};

export default PropertyAdministration;
