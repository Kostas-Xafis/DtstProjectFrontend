import React, { createContext, useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { isObjectEmpty, locationCheck } from '../utils/utils';

export type AuthData = Partial<{
	id: number;
	username: string;
	email: string;
	accessToken: string;
	tokenType: 'Bearer';
	roles: ['ROLE_ADMIN' | 'ROLE_USER'];
}>;

export type AuthUser = Partial<User>;

type AuthContextProp = {
	authData: Readonly<AuthData>;
	authUser: Readonly<AuthUser>;
	setAuthData: React.Dispatch<React.SetStateAction<AuthData>>;
	setAuthUser: React.Dispatch<React.SetStateAction<AuthUser>>;
};

export const AuthContext = createContext<AuthContextProp>({
	authData: {},
	authUser: {},
	setAuthData: (authData) => {},
	setAuthUser: (authUser) => {},
});

const Index = () => {
	const location = useLocation();
	const [authData, setAuthData] = useState<AuthData>({});
	const [authUser, setAuthUser] = useState<AuthUser>({});
	const navigate = useNavigate();

	useEffect(() => {
		if (!locationCheck(location, ['/', '/login', '/signup', '/new_user']) && isObjectEmpty(authData)) navigate('/');
	}, [authData]);

	return (
		<AuthContext.Provider value={{ authData, setAuthData, authUser, setAuthUser }}>
			{locationCheck(location, ['/']) ? (
				<div id="root_page">
					{locationCheck(location, ['/']) ? (
						<div id="links_container">
							<Link className="links" to="/login">
								<button type="button">Log In</button>
							</Link>
							<Link className="links" to="/signup">
								<button type="button">Sign Up</button>
							</Link>
						</div>
					) : (
						<></>
					)}
				</div>
			) : (
				<></>
			)}
			<Outlet />
		</AuthContext.Provider>
	);
};

export default Index;
