import { createContext } from 'react';
import { DependencyInjector } from '@mindspace-io/core';

/**
 * React Context to 'provide' the injector
 * Used with code like:
 *
 * ```ts
 * 	export const DependencyInjectionProvider: React.FC = ({ injector, children }) => {
 *		return (
 * 				<InjectorContext.Provider value={injector}>
 *				  {children}
 *				</InjectorContext.Provider>
 *		);
 *  };
 * ```
 */
export const InjectorContext = createContext<DependencyInjector>(null!);
