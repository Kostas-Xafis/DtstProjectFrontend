import { useContext, useEffect, useState, SyntheticEvent } from 'react';
import { BsTextParagraph } from 'react-icons/bs';
import { MdAttachMoney } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { useFetch } from '../../../hooks/useFetch';
import { getAttr } from '../../../utils/utils';
import { AuthContext } from '../../Index';
import { InputProps, Input } from '../../Inputs/Input';
import AssignNotary from '../AssignNotary/AssignNotary';
import css from './Taxes.module.css';

enum ETaxState {
	NO_STATE_ASSIGNED = 0,
	SELLER_ASSIGN_NOTARY = 1,
	WAIT_BUYER = 2,
	WAIT_SELLER_ASSIGN_NOTARY = 3,
	NOTARY_SET_DECLARATION = 4,
	WAIT_NOTARY_ASSIGN_DECLARATION = 5,
	SELLER_ACCEPT_DECLARATION = 6,
	WAIT_BUYER_ACCEPTANCE = 7,
	BUYER_ACCEPT_DECLARATION = 8,
	WAIT_SELLER_ACCEPTANCE = 9,
	BUYER_COMPLETE_PAYMENT = 10,
	WAIT_BUYER_PAYMENT = 11,
	NOTARY_WAIT_IN_PROGRESS = 12,
}

const TaxDeclaration = () => {
	const [fetchOnce, setFetchOnce] = useState<boolean>(false);
	const tax_id = Number(useParams().id);
	const user_id = useContext(AuthContext).authData.id;
	const [fetchData, setFetch] = useFetch<TaxDeclaration>({});
	const [taxState, setTaxState] = useState<ETaxState>(0);
	const [role, setRole] = useState<TaxRole>();

	console.log(ETaxState[taxState]);
	useEffect(() => {
		if (tax_id && !fetchOnce) {
			setFetch({ 'request': { 'method': 'GET', 'path': '/api/tax_declaration/' + tax_id } });
			setFetchOnce(true);
			return;
		}
		const { response } = fetchData;
		const { seller_id, buyer_id, notary_seller_id, notary_buyer_id, declaration_content, accepted, completed } =
			response as TaxDeclaration;
		if (seller_id === user_id) {
			// * SELLER STATE
			setRole('Seller');
			if (!notary_seller_id) return setTaxState(ETaxState.SELLER_ASSIGN_NOTARY);
			if (!buyer_id) return setTaxState(ETaxState.WAIT_BUYER);
			if (!declaration_content) return setTaxState(ETaxState.WAIT_NOTARY_ASSIGN_DECLARATION);
			if ((accepted & 1) == 0) return setTaxState(ETaxState.SELLER_ACCEPT_DECLARATION);
			if ((accepted & 2) == 0) return setTaxState(ETaxState.WAIT_BUYER_ACCEPTANCE);
			if (!completed) return setTaxState(ETaxState.WAIT_BUYER_PAYMENT);
		}
		if (buyer_id === user_id) {
			// * BUYER STATE
			setRole('Buyer');
			if (!notary_seller_id) return setTaxState(ETaxState.WAIT_SELLER_ASSIGN_NOTARY);
			if (!declaration_content) return setTaxState(ETaxState.WAIT_NOTARY_ASSIGN_DECLARATION);
			if ((accepted & 2) == 0) return setTaxState(ETaxState.BUYER_ACCEPT_DECLARATION);
			if ((accepted & 1) == 0) return setTaxState(ETaxState.WAIT_SELLER_ACCEPTANCE);
			if (!completed) return setTaxState(ETaxState.BUYER_COMPLETE_PAYMENT);
		}
		if (notary_seller_id === user_id || notary_buyer_id === user_id) {
			// * NOTARY STATE
			if (notary_seller_id === user_id) setRole("Seller's Notary");
			else setRole("Buyer's Notary");

			if (notary_seller_id && notary_buyer_id && !declaration_content)
				return setTaxState(ETaxState.NOTARY_SET_DECLARATION);
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
				<div id={css.message_container}>
					<p>Tax declaration in progress. Please wait until a buyer is found. </p>
				</div>
			);
			break;
		case ETaxState.WAIT_NOTARY_ASSIGN_DECLARATION:
			component = (
				<div id={css.message_container}>
					<p>Tax declaration in progress. Please wait while the notaries assign the declaration.</p>
				</div>
			);
			break;
		case ETaxState.SELLER_ACCEPT_DECLARATION:
			component = <Acceptance {...{ role, tax_id }} />;
			break;
		case ETaxState.WAIT_BUYER_ACCEPTANCE:
			component = (
				<div id={css.message_container}>
					<p>Tax declaration in progress. Please wait while the buyer accepts the declaration.</p>
				</div>
			);
			break;
		case ETaxState.WAIT_BUYER_PAYMENT:
			component = (
				<div id={css.message_container}>
					<p>Tax declaration in progress. Please wait while the buyer completes his payment.</p>
				</div>
			);
			break;

		// * BUYER STATE
		case ETaxState.WAIT_SELLER_ASSIGN_NOTARY:
			component = (
				<div id={css.message_container}>
					<p>Tax declaration in progress. Please wait while the seller assigns a notary.</p>
				</div>
			);
			break;
		case ETaxState.BUYER_ACCEPT_DECLARATION:
			component = <Acceptance {...{ role, tax_id }} />;
			break;
		case ETaxState.WAIT_SELLER_ACCEPTANCE:
			component = (
				<div id={css.message_container}>
					<p>Tax declaration in progress. Please wait while the seller accepts the declaration.</p>
				</div>
			);
			break;
		case ETaxState.BUYER_COMPLETE_PAYMENT:
			component = <BuyerPayment {...{ tax_id }} />;
			break;

		// * NOTARY STATE
		case ETaxState.NOTARY_SET_DECLARATION:
			component = <DeclarationContent {...{ tax_id, role }} />;
			break;
		case ETaxState.NOTARY_WAIT_IN_PROGRESS:
			component = (
				<div id={css.message_container}>
					<p>Tax declaration in progress.</p>
				</div>
			);
			break;
		default:
			component = <></>;
	}

	return component;
};

const Acceptance = ({ tax_id, role }: { tax_id: number; role?: TaxRole }) => {
	const [fetchData, setFetch] = useFetch({});
	const [accepted, setAccepted] = useState<boolean>(false);
	const { setAuthUser } = useContext(AuthContext);
	const onClick = (e: SyntheticEvent) => {
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
		if (!fetchData.response) return;
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
		history.back();
	}, [fetchData.response]);

	return (
		<div id={css.acceptance_container}>
			<p>Do you accept the declaration's content?</p>
			<div className={css.acceptance}>
				<button onClick={onClick} data-accept="accept">
					Accept
				</button>
				<button onClick={onClick} data-accept="decline">
					Decline
				</button>
			</div>
		</div>
	);
};

type SetDeclaration = {
	declaration_content: string;
	payment_amount: number;
};

type SetDeclarationInputs = {
	[P in keyof SetDeclaration]: InputProps;
};

const DeclarationContent = ({ tax_id, role }: { tax_id: number; role?: TaxRole }) => {
	const [fetchData, setFetch] = useFetch({});
	const [postData, setPostData] = useState<Partial<SetDeclaration>>({});
	const { setAuthUser } = useContext(AuthContext);

	const inputs: SetDeclarationInputs = {
		'declaration_content': {
			'htmlfor': 'declaration_content',
			'text': 'Content',
			'type': 'text',
			'placeholder': '',
			'inputIcon': <BsTextParagraph />,
			setPostData,
		},
		'payment_amount': {
			'htmlfor': 'payment_amount',
			'text': 'Payment amount',
			'type': 'number',
			'placeholder': '',
			'inputIcon': <MdAttachMoney />,
			setPostData,
		},
	};

	const onClick = (e: SyntheticEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!(postData?.declaration_content && postData.payment_amount)) return;
		if (!fetchData.request)
			setFetch({
				'request': {
					'method': 'POST',
					'path': '/api/tax_declaration/set_declaration',
					'body': { 'tax_declaration_id': tax_id, ...postData },
				},
			});
	};

	useEffect(() => {
		if (!fetchData.response) return;
		setAuthUser((user) => {
			if (role === "Buyer's Notary")
				user.buyerTaxDeclarationList?.forEach((tax) => {
					if (tax.id === tax_id) tax.declaration_content = postData?.declaration_content as string;
				});
			else if (role === "Seller's Notary")
				user.sellerNotaryList?.forEach((tax) => {
					if (tax.id === tax_id) tax.declaration_content = postData?.declaration_content as string;
				});
			return user;
		});
		history.back();
	}, [fetchData.response]);

	return (
		<div id={css.declaration_content_form}>
			<p>
				Set the declaration <span>content</span> and the final <span>payment amount</span>
			</p>
			{Object.values(inputs).map((inp, i) => (
				<div key={i} className={css.input_container}>
					<Input {...inp} />
				</div>
			))}
			<div id={css.submit_button} className={css.input_container}>
				<button onClick={onClick} type="button">
					<p>Set Declaration</p>
				</button>
			</div>
		</div>
	);
};

const BuyerPayment = ({ tax_id }: { tax_id: number }) => {
	const [fetchData, setFetch] = useFetch({});
	const { setAuthUser } = useContext(AuthContext);

	const onClick = (e: SyntheticEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setFetch({
			'request': {
				'method': 'POST',
				'path': '/api/tax_declaration/update_payment',
				'body': { 'tax_declaration_id': tax_id },
			},
		});
	};

	useEffect(() => {
		if (!fetchData.response) return;
		setAuthUser((user) => {
			user.buyerTaxDeclarationList?.forEach((tax) => {
				if ((tax.id = tax_id)) tax.completed = true;
			});
			return user;
		});
		history.back();
	}, [fetchData.response]);

	return (
		<div id={css.payment}>
			<p>Complete the transaction.</p>
			<button onClick={onClick} type="button">
				Complete
			</button>
		</div>
	);
};

export default TaxDeclaration;
