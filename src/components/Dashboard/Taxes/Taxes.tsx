import React, { useContext } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getAttr, locationCheck } from '../../../utils/utils';
import { AuthContext } from '../../Index';
import Table from '../../Table/Table';
import css from './Taxes.module.css';

export type TaxRole = 'Seller' | 'Buyer' | "Seller's Notary" | "Buyer's Notary";

type TaxDeclarationRole = Partial<TaxDeclaration & { role: TaxRole }>;

export const TaxesTable = Table<TaxDeclarationRole>();

const columnNames: Array<[string, keyof TaxDeclarationRole]> = [
	['Id', 'id'],
	['Statement', 'declaration_content'],
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

const Taxes = () => {
	const location = useLocation();
	const { buyerNotaryList, buyerTaxDeclarationList, sellerNotaryList, sellerTaxDeclarationList } =
		useContext(AuthContext).authUser;
	const navigate = useNavigate();
	const taxList = [
		...assignRole("Seller's Notary", sellerNotaryList),
		...assignRole('Seller', sellerTaxDeclarationList),
		...assignRole('Buyer', buyerNotaryList),
		...assignRole("Buyer's Notary", buyerTaxDeclarationList),
	];
	console.log(taxList);
	// !!! CHANGE THE TABLE VALUES
	return (
		<>
			{locationCheck(location, ['/dashboard/taxes']) ? (
				<div id={css.taxes_page}>
					<TaxesTable
						{...{
							name: 'Property Taxes',
							columns: columnNames,
							rows: taxList,
							onClickRow: ((e: React.SyntheticEvent) => {
								const id = getAttr(e.currentTarget as HTMLElement, 'data-id');
								navigate('/dashboard/taxes/' + id);
							}) as (e: React.SyntheticEvent) => {},
						}}
					/>
				</div>
			) : (
				<></>
			)}
			<Outlet />
		</>
	);
};

export default Taxes;
