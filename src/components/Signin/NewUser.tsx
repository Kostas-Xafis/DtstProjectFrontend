import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { InputProps, Input } from "../Inputs/Input";
import css from "./SignIn.module.css";

type UpdateBody = {
	firstname?: string;
	lastname?: string;
};

type InputsArray = { [Property in keyof UpdateBody]-?: InputProps };

const NewUser = () => {
	const [postData, setPostData] = useState<UpdateBody>({});
	const [fetchData, setFetch] = useFetch({}, true);

	const inputs: InputsArray = {
		"firstname": {
			htmlfor: "firstname",
			text: "Firstname",
			type: "text",
			placeholder: "e.g. Jackson",
			inputIcon: <FaUser />,
			setPostData,
		},
		"lastname": {
			htmlfor: "lastname",
			text: "Lastname",
			type: "text",
			placeholder: "e.g. Franklin",
			inputIcon: <FaUser />,
			setPostData,
		},
	};

	const onClickUpdate = (e: React.SyntheticEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!(postData.firstname && postData.lastname)) return;
		setFetch({
			"request": {
				"method": "POST",
				"path": "/api/users/update",
				"body": postData,
			},
		});
	};

	useEffect(() => {
		if (fetchData.response) document.getElementById("redirectLink")?.click();
	}, [fetchData]);

	return (
		<div id={css.form_container}>
			<form id={css.form} className={css.update}>
				{Object.values(inputs).map((data, i) => (
					<div key={i} className={css.inputRows}>
						<Input key={i} {...data} />
					</div>
				))}
				<div className={css.inputRows + " " + css.newUserForm} id={css.submitBtnContainer}>
					<Link id="redirectLink" to={"/dashboard"}>
						<button type="submit" onClick={onClickUpdate} className="submitButton">
							Next
						</button>
					</Link>
					<Link to={"/dashboard"}>
						<button type="submit" className="submitButton">
							Skip
						</button>
					</Link>
				</div>
			</form>
		</div>
	);
};

export default NewUser;
