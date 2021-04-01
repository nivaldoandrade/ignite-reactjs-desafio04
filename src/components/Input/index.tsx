import {
	useEffect,
	useRef,
	useState,
	useCallback,
} from 'react';

import { useField } from '@unform/core';

import { Container } from './styles';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	name: string;
	icon?: string;
}

export function Input({ name, icon, ...rest }: InputProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	const { fieldName, registerField, defaultValue } = useField(name);

	const [isFocused, setIsFocused] = useState(false);
	const [isFilled, setIsFilled] = useState(false);

	const handleInputFocus = useCallback(() => {
		setIsFocused(true);
	}, []);

	const handleInputBlur = useCallback(() => {
		setIsFocused(false);

		setIsFilled(!!inputRef.current?.value);
	}, []);

	useEffect(() => {
		registerField({
			name: fieldName,
			ref: inputRef.current,
			path: 'value',
		});
	}, [fieldName, registerField]);

	return (
		<Container isFilled={isFilled} isFocused={isFocused}>
			{/* {Icon && <Icon  size={20} />} */}

			<input
				onFocus={handleInputFocus}
				onBlur={handleInputBlur}
				defaultValue={defaultValue}
				ref={inputRef}
				{...rest}
			/>
		</Container>
	)
}
