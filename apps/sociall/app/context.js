import React, { createContext, useContext, useReducer } from 'react';

// Define the context
const GlobalStateContext = createContext();

// Initial state
const initialState = {
	facebookTokenExists: Boolean,
	jwtToken: '',
};

// Reducer function to manage state updates
function reducer(state, action) {
	switch (action.type) {
		case 'SET_FACEBOOK_TOKEN_EXISTS':
			return { ...state, facebookTokenExists: action.payload };
		case 'SET_JWT_TOKEN':
			return { ...state, jwtToken: action.payload };
		default:
			return state;
	}
}

// Context provider component
export function GlobalStateProvider({ children }) {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<GlobalStateContext.Provider value={{ state, dispatch }}>
			{children}
		</GlobalStateContext.Provider>
	);
}

// Hook to use global state in components
export function useGlobalState() {
	return useContext(GlobalStateContext);
}
