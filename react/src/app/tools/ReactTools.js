import React, { useRef, useState, useEffect } from "react";

export function useStateWithCallbackLazy(initialValue) {
	const callbackRef = useRef(null);
	const [value, setValue] = useState(initialValue);

	function setValueWithCallback(newValue, callback) {
		// const setValueWithCallback = useCallback((newValue, callback) => {
		callbackRef.current = callback;
		setValue(newValue);
	}

	useEffect(() => {
		if (callbackRef.current) {
			callbackRef.current(value);
			callbackRef.current = null;
		}
	}, [value]);

	return [value, setValueWithCallback];
}

export function useStateWithCallbackLazyForceEffect(initialValue) {
	// Data stored in value.value
	const [value, setValue] = useStateWithCallbackLazy({ value: initialValue });

	function setValueForce(newValue, callback) {
		setValue({ value: newValue }, callback);
	}

	return [value, setValueForce];
}

export function useStateWithPromiseLazy(initialValue) {
	const [value, setValue] = useStateWithCallbackLazy(initialValue);

	function setValuePromise(newValue) {
		return new Promise((resolve, reject) => {
			setValue(newValue, resolve);
		});
	}

	return [value, setValuePromise];
}

export function useStateWithPromiseLazyForceEffect(initialValue) {
	// Data stored in value.value
	const [value, setValue] = useStateWithCallbackLazyForceEffect(initialValue);

	function setValuePromise(newValue) {
		return new Promise((resolve, reject) => {
			setValue(newValue, resolve);
		});
	}

	return [value, setValuePromise];
}

export function useStateForceEffect(initialValue) {
	// Data stored in value.value
	const [value, setValue] = useState({ value: initialValue });

	function setValueForce(newValue) {
		setValue({ value: newValue });
	}

	return [value, setValueForce];
}

export function useMountedEffect(func, deps) {
	// Will not return for deconstructor
	const mountedRef = useRef(false);

	useEffect(() => {
		if (mountedRef.current) {
			var returnFunc = func();
		} else {
			mountedRef.current = true;
		}
	}, deps);
}
