import { ETHEREUM_NETWORK } from './constants';
import { ethers } from 'ethers';

// export const ethereumProvider: Readonly<ethers.providers.BaseProvider> = ethers.getDefaultProvider(ETHEREUM_NETWORK);
export const ethereumProvider: Readonly<ethers.providers.Web3Provider> = new ethers.providers.Web3Provider((window as any).ethereum);