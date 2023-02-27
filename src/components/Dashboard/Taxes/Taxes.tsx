import { useContext, SyntheticEvent } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getAttr, locationCheck } from '../../../utils/utils';
import { AuthContext } from '../../Index';
import Table from '../../Table/Table';
import css from './Taxes.module.css';

type TaxDeclarationRole = Partial<TaxDeclaration & { role: TaxRole }>;

const columnNames: Array<[string, keyof TaxDeclarationRole]> = [
	['Id', 'id'],
	['Content', 'declaration_content'],
	['Accepted', 'accepted'],
	['Completed', 'completed'],
	['Role', 'role'],
];

const assignRole = (role: TaxRole, list?: TaxDeclaration[]): TaxDeclarationRole[] => {
	if (!list?.length) return [];
	return list?.map((tax) => {
		//@ts-ignore
		tax.role = role;
		return tax;
	}) as TaxDeclarationRole[];
};

const TaxesTable = Table<TaxDeclarationRole>();

const Taxes = () => {
	const location = useLocation();
	const { buyerNotaryList, buyerTaxDeclarationList, sellerNotaryList, sellerTaxDeclarationList } =
		useContext(AuthContext).authUser;
	const navigate = useNavigate();
	const taxList = [
		...assignRole("Seller's Notary", sellerNotaryList),
		...assignRole('Seller', sellerTaxDeclarationList),
		...assignRole('Buyer', buyerTaxDeclarationList),
		...assignRole("Buyer's Notary", buyerNotaryList),
	];
	return (
		<div id={css.taxes_page}>
			{locationCheck(location, ['/dashboard/taxes']) ? (
				<TaxesTable
					{...{
						name: 'Property Taxes',
						columns: columnNames,
						rows: taxList,
						onClickRow: ((e: SyntheticEvent) => {
							const tax_id = getAttr(e.currentTarget as HTMLElement, 'data-id');
							if (taxList.find((tax) => tax.id === Number(tax_id))?.completed) return;
							navigate('/dashboard/taxes/' + tax_id);
						}) as (e: SyntheticEvent) => {},
						processDataColumn: {
							'accepted': (num) => {
								if (num === 0) return 'TBD';
								if (num === 1) return 'Seller accepted';
								if (num === 2) return 'Buyer accepted';
								return 'Both accepted';
							},
							'completed': (bool) => {
								return bool ? 'Yes' : 'No';
							},
						},
					}}
				/>
			) : (
				<Outlet />
			)}
		</div>
	);
};

export default Taxes;
