import { FC, ReactNode } from 'react';

type SuspenseProps = {
	id?: string;
	className?: string;
	children?: ReactNode[];
	empty?: boolean;
	proportions?: boolean;
};

const Suspense: FC<SuspenseProps> = ({ children, empty = false, proportions = true, id, className }) => {
	return (
		<div
			style={!proportions ? { height: '100%', width: '100%' } : {}}
			id={id}
			className={(!empty ? 'suspense ' : 'nosuspense ') + className}
		>
			{children ? children : <></>}
		</div>
	);
};

export default Suspense;
