import { createContext } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useFetch } from '../../../hooks/useFetch';
import { locationCheck } from '../../../utils/utils';
import Suspense from '../../Suspense/Suspense';
import css from './Properties.module.css';

export const PurchaseContext = createContext<{ id?: number }>({});

const Properites = () => {
	const [fetchData, _] = useFetch<Array<RealEstate>>({ 'request': { 'method': 'GET', 'path': '/api/real_estate' } });
	const location = useLocation();
	const { response } = fetchData;

	return (
		<>
			{locationCheck(location, ['/dashboard/properties']) ? (
				<div id={css.properties_list}>
					{response
						? response.map((estate, i) => (
								<div className={css.property_container} key={i}>
									<div className={css.property_details_container}>
										<p className={css.property_detail}>
											<span>Address</span>: <span>{estate.address}</span>
										</p>
										<p className={css.property_detail}>
											<span>Road number:</span> <span>{estate.road_number} </span>
										</p>
										<p className={css.property_detail}>
											<span>Area code:</span> <span>{estate.area_code}</span>
										</p>
										<p className={css.property_detail}>
											<span>Area size:</span>
											<span>
												{' ' + estate.area_size}m<sup>2</sup>
											</span>
										</p>
									</div>
									<div className={css.property_description}>
										<p>Description: </p>
										<p>{estate.description}</p>
									</div>
									<Link
										to={'/dashboard/properties/purchase/' + estate.taxDeclaration.id}
										className={css.purchase_button}
									>
										<p>Purchase</p>
									</Link>
								</div>
						  ))
						: [1, 2].map((n, i) => (
								<Suspense
									key={i}
									className={css.property_container}
									children={[
										<Suspense
											key={1}
											className={css.property_details_container}
											empty={true}
											children={[
												<Suspense
													key={1}
													proportions={false}
													className={css.property_detail}
												></Suspense>,
												<Suspense
													key={2}
													proportions={false}
													className={css.property_detail}
												></Suspense>,
												<Suspense
													key={3}
													proportions={false}
													className={css.property_detail}
												></Suspense>,
											]}
										/>,
										<Suspense key={2} empty={true} className={css.property_description} />,
										<Suspense key={3} className={css.purchase_button} />,
									]}
								/>
						  ))}
				</div>
			) : (
				<Outlet />
			)}
		</>
	);
};

export default Properites;
