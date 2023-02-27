import { useContext, useEffect, SyntheticEvent } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { isObjectEmpty, locationCheck } from '../../utils/utils';
import { useFetch } from '../../hooks/useFetch';
import { AuthContext } from '../Index';
import css from './Dashboard.module.css';
import { BsArrowLeft } from 'react-icons/bs';

const Dashboard = () => {
	const [fetchData, setFetch] = useFetch<User>({}, true);
	const location = useLocation();
	const { authData, setAuthData, setAuthUser } = useContext(AuthContext);
	const navigate = useNavigate();

	const onClickBack = (e: SyntheticEvent) => {
		e.preventDefault();
		e.stopPropagation();
		history.back();
	};

	const onClickLogOut = (e: SyntheticEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setFetch({ 'request': { 'method': 'POST', 'path': '/api/auth/logout' } });
		setAuthData({});
		setAuthUser({});
		navigate('/');
	};

	useEffect(() => {
		if (isObjectEmpty(authData)) return;
		if (fetchData.response) {
			setAuthUser(fetchData.response);
		} else if (!fetchData.request && !fetchData.error)
			setFetch({
				'request': {
					'method': 'GET',
					'path': '/api/users/' + authData.id,
				},
			});
	}, [authData, fetchData.response]);
	const isUser = authData.roles?.includes('ROLE_USER');
	return (
		<div id={css.Dashboard}>
			<div id={css.sidebar} className={isUser ? css.user_role : css.admin_role}>
				<div className={css.sidebar_content}>
					<p className={css.sidebar_button}>Welcome {authData.username}</p>
				</div>
				{isUser ? (
					<>
						<Link className={css.sidebar_content} to={'/dashboard/properties'}>
							<p className={css.sidebar_button}>Search Properties</p>
						</Link>
						<Link className={css.sidebar_content} to={'/dashboard/sale'}>
							<p className={css.sidebar_button}>Property sale</p>
						</Link>
						<Link className={css.sidebar_content} to={'/dashboard/taxes'}>
							<p className={css.sidebar_button}>Taxes</p>
						</Link>
					</>
				) : (
					<Link className={css.sidebar_content} to={'/dashboard/administration'}>
						<p className={css.sidebar_button}>Administration</p>
					</Link>
				)}
				<Link className={css.sidebar_content} to={'/dashboard/settings'}>
					<p className={css.sidebar_button}>Settings</p>
				</Link>
				<Link onClick={onClickLogOut} className={css.sidebar_content} to={'/'}>
					<p className={css.sidebar_button}>Log Out</p>
				</Link>
			</div>

			<div id={css.main_content}>
				{!locationCheck(location, ['/dashboard']) ? (
					<Link onClick={onClickBack} id={css.back_button} to={'/'}>
						<BsArrowLeft />
					</Link>
				) : (
					<></>
				)}
				<Outlet />
			</div>
		</div>
	);
};

export default Dashboard;
