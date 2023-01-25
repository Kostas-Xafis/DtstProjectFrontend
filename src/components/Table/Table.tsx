import React, { FC } from 'react';
import Suspense from '../Suspense/Suspense';
import css from './Table.module.css';

type TableProps<T> = {
	name: string;
	columns: Array<[string, keyof T]>;
	rows: T[] | undefined;
	onClickRow?: (e: React.SyntheticEvent) => {};
	processDataColumn?: { [P in keyof T]: (val: T[P]) => string | number };
};

const Table = <T extends { id?: number }>(): FC<TableProps<T>> => {
	return <T extends { id?: number }>({ name, columns, rows, onClickRow, processDataColumn }: TableProps<T>) => {
		return rows?.length ? (
			<div className={css.table_container}>
				<p className={css.table_name}>{name}</p>
				<div className={css.table}>
					<div className={css.table_col}>
						{columns.map((columnName, i) => (
							<div className={css.table_value} key={i}>
								<p>{columnName[0]}</p>
							</div>
						))}
						<div className={css.rowBottomBorder}></div>
					</div>
					<div className={css.table_rows}>
						{rows.map((row, i) => (
							<div data-id={row.id} onClick={onClickRow} className={css.table_row} key={i}>
								{Object.values(row).map((val, j) => {
									if (j >= columns.length) return <React.Fragment key={j}></React.Fragment>;
									const columnName = columns[j][1];
									const rowValue = row[columnName];
									return (
										<div className={css.table_value} key={j}>
											{processDataColumn && processDataColumn[columnName] ? (
												<p>{processDataColumn[columnName](rowValue)} </p>
											) : (
												<p>{rowValue as string | number}</p>
											)}
										</div>
									);
								})}
								<div className={css.rowBottomBorder}></div>
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

export const RealEstateTable = Table<Partial<RealEstate>>();
export const UserTable = Table<Partial<User>>();
export const TaxesTable = Table<Partial<TaxDeclaration>>();
