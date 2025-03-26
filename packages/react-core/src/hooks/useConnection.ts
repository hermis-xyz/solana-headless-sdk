import { Connection, WalletAdapterNetwork } from '@agateh/solana-headless-core';
import { createContext, useContext } from 'react';

/**
 * State for the connection context
 */
export interface ConnectionContextState {
    connection: Connection;
    network?: WalletAdapterNetwork
}

/**
 * Context for connection functionality
 */
export const ConnectionContext = createContext<ConnectionContextState>({} as ConnectionContextState);

/**
 * Hook for accessing Solana connection
 * 
 * @returns ConnectionContextState
 */
export function useConnection(): ConnectionContextState {
    return useContext(ConnectionContext);
}