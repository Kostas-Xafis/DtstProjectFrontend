import { useState, useEffect, CSSProperties } from "react";
import { FC } from "react";
import css from "./Input.module.css";

type InputInvalidMsgProp = { parentId: string };

function getRectPos(elem: HTMLElement) {
	return elem.getBoundingClientRect();
}

export const InputInvalidMsg: FC<InputInvalidMsgProp> = ({ parentId }) => {
	const [validMessages, setMessages] = useState<string[]>([]);

	useEffect(() => {
		const msgBox = document.getElementById(parentId);
		const msgContainer = msgBox?.children[0];
		const label = msgBox?.previousSibling;
		//leftValue = labelcontainer width + 4vw padding + 40pixels star + 40pixels triangle + 10px spacing
		if (!label || !msgContainer) return;
		const leftValue = getRectPos(label as HTMLElement).width + 55;
		msgBox.style.setProperty("left", leftValue + "px");
		msgBox.addEventListener("updateContent", (e: CustomEventInit<string[]>) => {
			if (matchMedia("(hover:none").matches) {
				(msgContainer.parentNode as HTMLElement).style.setProperty(
					"display",
					e.detail?.length ? "block" : "none"
				);
			}
			setMessages(e.detail || []);
		});
	});

	return (
		<div id={parentId} className={css.ValidateMsg} style={{ display: validMessages.length ? "grid" : "none" }}>
			<div className={css.invalidMsgContainer}>
				{validMessages.map((message, i) => (
					<p
						key={i}
						style={{ "--row": Math.floor(100 * Math.log(i + 1)) + "ms" } as CSSProperties}
						className={css.InvalidMsgText}
					>
						{message}
					</p>
				))}
			</div>
			<div className={css.triangle1}></div>
			<div className={css.triangle2}></div>
		</div>
	);
};
