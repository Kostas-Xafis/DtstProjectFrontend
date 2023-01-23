import React, { FC } from 'react';
import Suspense from '../Suspense/Suspense';
import css from './Table.module.css';

type TableProps<T> = {
	name: string;
	columns: Array<[string, keyof T]>;
	rows: T[] | undefined;
	onClickRow?: (e: React.SyntheticEvent) => {};
};

const Table = <T extends { id?: number }>(): FC<TableProps<T>> => {
	return <T extends { id?: number }>({ name, columns, rows, onClickRow }: TableProps<T>) => {
		return rows?.length ? (
			<div className={css.table_container}>
				<p className={css.table_name}>{name}</p>
				<div className={css.table}>
					<div className={css.table_col}>
						{columns.map((val, i) => (
							<div className={css.table_value} key={i}>
								<p>{val[0]}</p>
							</div>
						))}
					</div>
					<div className={css.table_rows}>
						{rows.map((row, i) => (
							<div data-id={row.id} onClick={onClickRow} className={css.table_row} key={i}>
								{Object.values(row).map((val, i) => {
									if (i >= columns.length) return <React.Fragment key={i}></React.Fragment>;
									return (
										<div className={css.table_value} key={i}>
											<p>{row[columns[i][1]] as string | number}</p>
										</div>
									);
								})}
							</div>
						))}
					</div>
				</div>
			</div>
		) : (
			<Suspense
				empty={true}
				className={css.table_container}
				children={[
					<p key={1} className={css.table_name}>
						{name}
					</p>,
					<Suspense key={2} className={css.table} />,
				]}
			/>
		);
	};
};

export default Table;

export const RealEstateTable = Table<RealEstate>();
export const UserTable = Table<User>();
