import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '../../../hooks/useFetch';
import { getAttr } from '../../../utils/utils';
import { AuthContext } from '../../Index';
import AssignNotary from '../AssignNotary/AssignNotary';
import { TaxRole } from './Taxes';

enum ETaxState {
	NO_STATE_ASSIGNED = 0,
	SELLER_ASSIGN_NOTARY = 1,
	WAIT_BUYER = 2,
	WAIT_SELLER_ASSIGN_NOTARY = 3,
	NOTARY_SET_STATEMENT = 4,
	WAIT_NOTARY_ASSIGN_DECLARATION = 5,
	SELLER_ACCEPT_DECLARATION = 6,
	WAIT_BUYER_ACCEPTANCE = 7,
	BUYER_ACCEPT_DECLARATION = 8,
	WAIT_SELLER_ACCEPTANCE = 9,
	BUYER_COMPLETE_PAYMENT = 10,
	WAIT_BUYER_PAYMENT = 11,
	NOTARY_SET_DECLARATION = 12,
	NOTARY_WAIT_IN_PROGRESS = 13,
}

const TaxDeclaration = () => {
	const [fetchOnce, setFetchOnce] = useState<boolean>(false);
	const tax_id = Number(useParams().id);
	const user_id = useContext(AuthContext).authData.id;
	const [fetchData, setFetch] = useFetch<TaxDeclarationResponse>({});
	const [taxState, setTaxState] = useState<ETaxState>(0);

	console.log(taxState, ETaxState[taxState]);
	useEffect(() => {
		if (tax_id && !fetchOnce) {
			setFetch({ 'request': { 'method': 'GET', 'path': '/api/tax_declaration/' + tax_id } });
			setFetchOnce(true);
			return;
		}
		const { response } = fetchData;
		const { seller_id, buyer_id, notary_seller_id, notary_buyer_id, declaration_content, accepted, completed } =
			response as TaxDeclarationResponse;
		if (seller_id === user_id) {
			// Seller state
			if (!notary_seller_id) return setTaxState(ETaxState.SELLER_ASSIGN_NOTARY);
			if (!buyer_id) return setTaxState(ETaxState.WAIT_BUYER);
			if (!declaration_content) return setTaxState(ETaxState.WAIT_NOTARY_ASSIGN_DECLARATION);
			if (accepted && (accepted & 1) == 0) return setTaxState(ETaxState.SELLER_ACCEPT_DECLARATION);
			if (accepted && (accepted & 2) == 0) return setTaxState(ETaxState.WAIT_BUYER_ACCEPTANCE);
			if (!completed) return setTaxState(ETaxState.WAIT_BUYER_PAYMENT);
		}
		if (buyer_id === user_id) {
			// Buyer state
			if (!notary_seller_id) return setTaxState(ETaxState.WAIT_SELLER_ASSIGN_NOTARY);
			if (!declaration_content) return setTaxState(ETaxState.WAIT_NOTARY_ASSIGN_DECLARATION);
			if (accepted && (accepted & 2) == 0) return setTaxState(ETaxState.BUYER_ACCEPT_DECLARATION);
			if (accepted && (accepted & 1) == 0) return setTaxState(ETaxState.WAIT_SELLER_ACCEPTANCE);
			if (!completed) return setTaxState(ETaxState.BUYER_COMPLETE_PAYMENT);
		}
		if (notary_seller_id === user_id || notary_buyer_id === user_id) {
			if (notary_seller_id && notary_buyer_id && !declaration_content)
				return setTaxState(ETaxState.NOTARY_SET_STATEMENT);
			else return setTaxState(ETaxState.NOTARY_WAIT_IN_PROGRESS);
		}
	}, [tax_id, fetchData.response]);

	let component;
	switch (taxState) {
		// * SELLER STATE
		case ETaxState.SELLER_ASSIGN_NOTARY:
			component = <AssignNotary />;
			break;
		case ETaxState.WAIT_BUYER:
			component = (
				<div>
					<p>Tax declaration in progress. Please wait until a buyer is found. </p>
				</div>
			);
			break;
		case ETaxState.WAIT_NOTARY_ASSIGN_DECLARATION:
			component = (
				<div>
					<p>Tax declaration in progress. Please wait while the notaries assign the declaration.</p>
				</div>
			);
			break;
		case ETaxState.SELLER_ACCEPT_DECLARATION:
			component = (
				<div>
					<p>Do you accept the declaration</p>
					<Acceptance {...{ role: 'Seller', tax_id }} />
				</div>
			);
			break;
		case ETaxState.WAIT_BUYER_ACCEPTANCE:
			component = (
				<div>
					<p>Tax declaration in progress. Please wait while the buyer accepts the declaration.</p>
				</div>
			);
			break;
		case ETaxState.WAIT_BUYER_PAYMENT:
			component = (
				<div>
					<p>Tax declaration in progress. Please wait while the buyer completes his payment.</p>
				</div>
			);
			break;

		// * BUYER STATE
		case ETaxState.WAIT_SELLER_ASSIGN_NOTARY:
			component = (
				<div>
					<p>Tax declaration in progress. Please wait while the seller assigns a notary.</p>
				</div>
			);
			break;
		case ETaxState.BUYER_ACCEPT_DECLARATION:
			component = (
				<div>
					<p>Do you accept the declaration</p>
					<Acceptance {...{ role: 'Buyer', tax_id }} />
				</div>
			);
			break;
		case ETaxState.WAIT_SELLER_ACCEPTANCE:
			component = (
				<div>
					<p>Tax declaration in progress. Please wait while the seller accepts the declaration.</p>
				</div>
			);
			break;
		case ETaxState.BUYER_COMPLETE_PAYMENT:
			component = <div>Hello bob</div>;
			break;

		// * NOTARY STATE
		case ETaxState.NOTARY_SET_STATEMENT:
			component = <div>Hello bob</div>;
			break;
		case ETaxState.NOTARY_WAIT_IN_PROGRESS:
			component = (
				<div>
					<p>Tax declaration in progress.</p>
				</div>
			);
			break;
		default:
			component = <></>;
	}

	return <>{component}</>;
};

const acceptIncrement = (role: TaxRole, accepted: boolean) => {
	if (role === 'Seller') return accepted ? 1 : 4;
	if (role === 'Buyer') return accepted ? 2 : 8;
};

const Acceptance = ({ tax_id, role }: { tax_id: number; role: TaxRole }) => {
	const [fetchData, setFetch] = useFetch({});
	const [accepted, setAccepted] = useState<boolean>(false);
	const navigate = useNavigate();
	const { setAuthUser } = useContext(AuthContext);
	const onClick = (e: React.SyntheticEvent) => {
		e.preventDefault();
		e.stopPropagation();
		const acceptance = getAttr(e.target as HTMLElement, 'data-accept') === 'accept';
		setFetch({
			'request': {
				'method': 'POST',
				'path': '/api/tax_declaration/accept_declaration',
				'body': { 'tax_declaration_id': tax_id, acceptance },
			},
		});
		setAccepted(acceptance);
	};

	useEffect(() => {
		setAuthUser((authUser) => {
			if (accepted) {
				if (role === 'Seller')
					authUser.sellerTaxDeclarationList?.forEach((tax) => {
						if (tax.id === tax_id) tax.accepted += 1;
					});
				if (role === 'Buyer')
					authUser.buyerTaxDeclarationList?.forEach((tax) => {
						if (tax.id === tax_id) tax.accepted += 2;
					});
			} else {
				if (role === 'Seller')
					authUser.sellerTaxDeclarationList = authUser.sellerTaxDeclarationList?.filter(
						(tax) => tax.id !== tax_id
					);
				if (role === 'Buyer')
					authUser.buyerTaxDeclarationList = authUser.buyerTaxDeclarationList?.filter(
						(tax) => tax.id !== tax_id
					);
			}
			return authUser;
		});
		navigate('/dashboard/taxes');
	}, [fetchData.response]);

	return (
		<div id="css.Acceptance">
			<button onClick={onClick} data-accept={'accept'} id="css.acceptButton">
				Accept
			</button>
			<button onClick={onClick} data-accept={'decline'} id="css.declineButton">
				Decline
			</button>
		</div>
	);
};

export default TaxDeclaration;
