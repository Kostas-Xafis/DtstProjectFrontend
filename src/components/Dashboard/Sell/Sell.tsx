import React, { useContext } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getAttr, locationCheck } from '../../../utils/utils';
import { AuthContext } from '../../Index';
import css from './Sell.module.css';
import { RealEstateTable } from '../../Table/Table';

const columnNames: Array<[string, keyof RealEstate]> = [
	['Id', 'id'],
	['Address', 'address'],
	['Road Number', 'road_number'],
	['Area Code', 'area_code'],
	['Area Size', 'area_size'],
	['Description', 'description'],
];
const Sell = () => {
	const location = useLocation();
	const { realEstateList } = useContext(AuthContext).authUser;
	const navigate = useNavigate();
	return (
		<>
			{locationCheck(location, ['/dashboard/sell']) ? (
				<div id={css.sell_page}>
					<RealEstateTable
						{...{
							name: 'Selling',
							columns: columnNames,
							rows: realEstateList,
							onClickRow: ((e: React.SyntheticEvent) => {
								const id = getAttr(e.currentTarget as HTMLElement, 'data-id');
								navigate('/dashboard/sell/property/' + id);
							}) as (e: React.SyntheticEvent) => {},
						}}
					/>
					<Link id={css.add_property} to={'/dashboard/sell/property'}>
						<AiOutlinePlus />
					</Link>
				</div>
			) : (
				<></>
			)}
			<Outlet />
		</>
	);
};

export default Sell;
