import { useState, useEffect, useContext, SyntheticEvent } from 'react';
import { Input, InputProps } from '../../Inputs/Input';
import { AiOutlineFieldNumber } from 'react-icons/ai';
import { BsSignpostSplitFill, BsTextParagraph } from 'react-icons/bs';
import { MdLocationPin } from 'react-icons/md';
import { RxRulerSquare } from 'react-icons/rx';
import css from './Sale.module.css';
import { useFetch } from '../../../hooks/useFetch';
import { AuthContext } from '../../Index';
import { useParams } from 'react-router-dom';

type RealEstateForm = {
	[Property in keyof RealEstate]?: RealEstate[Property];
};

// Create Update Delete Real Estate
const CUDProperty = ({ create = true }: { create: boolean }) => {
	const [inputOnce, setInputsOnce] = useState<boolean>(false);
	const [postData, setPostData] = useState<RealEstateForm>({});
	const [fetchData, setFetch] = useFetch<RealEstateForm>({});
	const { authUser, setAuthUser } = useContext(AuthContext);
	const id = Number(useParams().id);
	const inputs: { [Property in keyof RealEstateForm]: InputProps } = {
		'address': {
			'htmlfor': 'address',
			'text': 'Address',
			'type': 'text',
			'placeholder': 'e.g. Berkeley St.',
			'inputIcon': <BsSignpostSplitFill />,
			setPostData,
		},
		'road_number': {
			'htmlfor': 'road_number',
			'text': 'Road Number',
			'type': 'number',
			'placeholder': 'e.g. 24',
			'inputIcon': <AiOutlineFieldNumber />,
			setPostData,
		},
		'area_code': {
			'htmlfor': 'area_code',
			'text': 'Area Code',
			'placeholder': 'e.g. 72921',
			'type': 'number',
			'inputIcon': <MdLocationPin />,
			setPostData,
		},
		'area_size': {
			'htmlfor': 'area_size',
			'text': 'Area Size',
			'placeholder': 'e.g. 125 m²',
			'type': 'number',
			'inputIcon': <RxRulerSquare />,
			setPostData,
		},
		'description': {
			'htmlfor': 'description',
			'text': 'Description',
			'type': 'text',
			'inputIcon': <BsTextParagraph />,
			setPostData,
		},
	};

	const onClickCURealEstate = (e: SyntheticEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (
			!postData.road_number &&
			!postData.address &&
			!postData.area_code &&
			!postData.area_size &&
			!postData.description
		) {
			return;
		}
		setFetch({
			'request': {
				'method': 'POST',
				'path': '/api/real_estate' + (create ? '' : '/update'),
				'body': { id, ...postData },
			},
		});
		if (!create)
			setAuthUser((user) => {
				user.realEstateList = user.realEstateList?.map((estate) => {
					if (estate.id === id) estate = { ...estate, ...(postData as RealEstate) };
					return estate;
				});
				return user;
			});
	};

	const onClickDeleteRealEstate = (e: SyntheticEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setFetch({
			'request': { 'method': 'DELETE', 'path': '/api/real_estate/' + id },
		});

		setAuthUser((user) => {
			user.realEstateList = user.realEstateList?.filter((estate) => estate.id !== id);
			return user;
		});
	};

	useEffect(() => {
		if (id && !inputOnce) {
			const updateEstate = authUser.realEstateList?.filter((estate) => estate.id === id);
			if (updateEstate?.length) {
				const estate = updateEstate[0];
				(document.querySelectorAll(`#${css.add_property_form} input`) as NodeListOf<HTMLInputElement>).forEach(
					(el) => {
						el.value = estate[el.name as keyof RealEstate] as string;
					}
				);
			}
			setInputsOnce(true);
			return;
		}
		const { response } = fetchData;
		if (create && response) {
			setAuthUser((user) => {
				postData.id = create ? response.id : id;
				user.realEstateList?.push({ ...(postData as RealEstate) });
				return user;
			});
		}
		if (response) history.back();
	}, [id, fetchData.response]);

	return (
		<form id={css.add_property_form}>
			{Object.values(inputs).map((inp, i) => (
				<div className={css.input_container} key={i}>
					<Input {...inp} key={i} />
				</div>
			))}
			<div id={!create ? css.actionButtons : ''} className={css.input_container}>
				<button onClick={onClickCURealEstate} type="submit">
					<p>{create ? 'Post for sale' : 'Update property'}</p>
				</button>
				{create ? (
					<></>
				) : (
					<button onClick={onClickDeleteRealEstate} type="submit">
						<p>Remove Property</p>
					</button>
				)}
			</div>
		</form>
	);
};

export default CUDProperty;
