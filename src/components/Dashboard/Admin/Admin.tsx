import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useFetch } from '../../../hooks/useFetch';
import { getAttr, locationCheck } from '../../../utils/utils';
import { RealEstateTable, TaxesTable, UserTable } from '../../Table/Table';
import css from './Admin.module.css';

const taxesColumns: Array<[string, keyof TaxDeclaration]> = [
	['Id', 'id'],
	['Seller', 'seller_id'],
	["Seller's Notary", 'notary_seller_id'],
	['Buyer', 'buyer_id'],
	["Buyer's Notary", 'notary_buyer_id'],
	['Content', 'declaration_content'],
	['Payment Id', 'payment_id'],
	['Accepted', 'accepted'],
	['Completed', 'completed'],
];

const usersColumns: Array<[string, keyof User]> = [
	['Id', 'id'],
	['Username', 'username'],
	['Firstname', 'firstname'],
	['Lastname', 'lastname'],
	['Email', 'email'],
	['Role', 'roles'],
	['Seller Tax', 'sellerTaxDeclarationList'],
	["Seller's Notary Tax", 'sellerNotaryList'],
	['Buyer Tax', 'buyerTaxDeclarationList'],
	["Buyer's Notary Tax", 'buyerNotaryList'],
];

const estateColumns: Array<[string, keyof RealEstate]> = [
	['Id', 'id'],
	['Tax Id', 'taxDeclaration'],
	['Address', 'address'],
	['Road Number', 'road_number'],
	['Area Code', 'area_code'],
	['Area Size', 'area_size'],
	['Description', 'description'],
];

const Admin = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const realEstateList = useGetAllList<RealEstate>('/api/real_estate');
	const taxesList = useGetAllList<TaxDeclaration>('/api/tax_declaration');
	const usersList = useGetAllList<User>('/api/users');
	return (
		<div id={css.tables_page}>
			{!locationCheck(location, ['/dashboard/administration']) ? (
				<Outlet />
			) : (
				<>
					<UserTable
						{...{
							name: 'Users',
							columns: usersColumns,
							rows: usersList,
							onClickRow: ((e: React.SyntheticEvent) => {
								const id = getAttr(e.currentTarget as HTMLElement, 'data-id');
								navigate('/dashboard/administration/user/' + id);
							}) as (e: React.SyntheticEvent) => {},
							processDataColumn: {
								'roles': (role) => (role?.length ? role[0].name : ''),
								'sellerTaxDeclarationList': (list) => list?.length || 0,
								'sellerNotaryList': (list) => list?.length || 0,
								'buyerTaxDeclarationList': (list) => list?.length || 0,
								'buyerNotaryList': (list) => list?.length || 0,
							},
						}}
					/>
					<RealEstateTable
						{...{
							name: 'Posted properties',
							columns: estateColumns,
							rows: realEstateList,
							onClickRow: ((e: React.SyntheticEvent) => {
								const id = getAttr(e.currentTarget as HTMLElement, 'data-id');
								navigate('/dashboard/administration/property/' + id);
							}) as (e: React.SyntheticEvent) => {},
							processDataColumn: {
								'area_size': (area) => area + ' m²',
								'taxDeclaration': (tax) => tax?.id || '',
							},
						}}
					/>
					<TaxesTable
						{...{
							name: 'Property Taxes',
							columns: taxesColumns,
							rows: taxesList,
							onClickRow: ((e: React.SyntheticEvent) => {
								const tax_id = getAttr(e.currentTarget as HTMLElement, 'data-id');
								if (taxesList.find((tax) => tax.id === Number(tax_id))?.completed) return;
								navigate('/dashboard/administration/tax/' + tax_id);
							}) as (e: React.SyntheticEvent) => {},
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
								'seller_id': (id) => usersList.find((user) => user.id === id)?.username || '',
								'notary_seller_id': (id) => usersList.find((user) => user.id === id)?.username || '',
								'buyer_id': (id) => usersList.find((user) => user.id === id)?.username || '',
								'notary_buyer_id': (id) => usersList.find((user) => user.id === id)?.username || '',
							},
						}}
					/>
				</>
			)}
		</div>
	);
};

const useGetAllList = <T,>(path: string) => {
	const [fetchData, _] = useFetch<T[]>({ 'request': { 'method': 'GET', path } });
	const [list, setList] = useState<T[]>([]);
	useEffect(() => {
		if (fetchData.request || fetchData.error) return;
		setList(fetchData.response as T[]);
	}, [fetchData]);
	return list;
};

export default Admin;
