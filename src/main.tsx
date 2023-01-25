import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Index from './components/Index';
import SignIn from './components/Signin/SignIn';
import NewUser from './components/Signin/NewUser';
import Dashboard from './components/Dashboard/Dashboard';
import Properties from './components/Dashboard/Properties/Properties';
import Sell from './components/Dashboard/Sell/Sell';
import CUDProperty from './components/Dashboard/Sell/CreateUpdateDeleteProperty';
import Taxes from './components/Dashboard/Taxes/Taxes';
import TaxDeclaration from './components/Dashboard/Taxes/TaxDeclaration';
import AssignNotary from './components/Dashboard/AssignNotary/AssignNotary';
import Settings from './components/Dashboard/Settings/Settings';
import Admin from './components/Dashboard/Admin/Admin';
import UserAdministration from './components/Dashboard/Admin/UserAdministration';
import PropertyAdministration from './components/Dashboard/Admin/PropertyAdministration';
import TaxAdministration from './components/Dashboard/Admin/TaxAdministration';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Index />,
		children: [
			{
				path: '/login',
				element: <SignIn signup={false} />,
			},
			{
				path: '/signup',
				element: <SignIn signup={true} />,
			},
			{
				path: '/new_user',
				element: <NewUser />,
			},
			{
				path: '/dashboard',
				element: <Dashboard />,
				children: [
					{
						path: '/dashboard/properties',
						element: <Properties />,
						children: [
							{
								path: '/dashboard/properties/purchase/:id',
								element: <AssignNotary />,
							},
						],
					},
					{
						path: '/dashboard/sell',
						element: <Sell />,
						children: [
							{
								path: '/dashboard/sell/property',
								element: <CUDProperty {...{ create: true }} />,
							},
							{
								path: '/dashboard/sell/property/:id',
								element: <CUDProperty {...{ create: false }} />,
							},
						],
					},
					{
						path: '/dashboard/taxes',
						element: <Taxes />,
						children: [
							{
								path: '/dashboard/taxes/:id',
								element: <TaxDeclaration />,
							},
						],
					},
					{
						path: '/dashboard/settings',
						element: <Settings />,
					},
					{
						path: '/dashboard/administration',
						element: <Admin />,
						children: [
							{
								path: '/dashboard/administration/user/:id',
								element: <UserAdministration />,
							},
							{
								path: '/dashboard/administration/property/:id',
								element: <PropertyAdministration />,
							},
							{
								path: '/dashboard/administration/tax/:id',
								element: <TaxAdministration />,
							},
						],
					},
				],
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<RouterProvider router={router} />);
