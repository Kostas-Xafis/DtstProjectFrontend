import { FC, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import css from "./Input.module.css";

export const PwdEye: FC<{ parentId: string }> = ({ parentId }) => {
	const [isVisible, setVisible] = useState<boolean>(false);
	const input = document.getElementById(parentId) as HTMLInputElement;
	if (input) input.type = isVisible ? "text" : "password";
	return (
		<div onClick={() => setVisible(!isVisible)} className={css.inputEyeIcon}>
			{isVisible ? <FiEye /> : <FiEyeOff />}
		</div>
	);
};
