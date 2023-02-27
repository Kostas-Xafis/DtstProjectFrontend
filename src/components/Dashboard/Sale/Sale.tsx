import { useContext, SyntheticEvent } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getAttr, locationCheck } from '../../../utils/utils';
import { AuthContext } from '../../Index';
import css from './Sale.module.css';
import { RealEstateTable } from '../../Table/Table';

const columnNames: Array<[string, keyof RealEstate]> = [
	['Id', 'id'],
	['Address', 'address'],
	['Road Number', 'road_number'],
	['Area Code', 'area_code'],
	['Area Size', 'area_size'],
	['Description', 'description'],
];
const Sale = () => {
	const location = useLocation();
	const { realEstateList } = useContext(AuthContext).authUser;
	const navigate = useNavigate();
	return (
		<>
			{locationCheck(location, ['/dashboard/sale']) ? (
				<div id={css.sale_page}>
					<RealEstateTable
						{...{
							name: 'Selling',
							columns: columnNames,
							rows: realEstateList,
							onClickRow: ((e: SyntheticEvent) => {
								const id = getAttr(e.currentTarget as HTMLElement, 'data-id');
								navigate('/dashboard/sale/property/' + id);
							}) as (e: SyntheticEvent) => {},
							processDataColumn: {
								'area_size': (area) => area + ' m²',
							},
						}}
					/>
					<Link id={css.add_property} to={'/dashboard/sale/post'}>
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

export default Sale;
