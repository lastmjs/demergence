import { IdeaProposal } from '../index.d';
import { ethers } from 'ethers';

export async function fetchIdeaProposals(
    demergenceContractAddress: string,
    demergenceContractABI: Array<string>,
    ethereumProvider: Readonly<ethers.providers.Web3Provider>
): Promise<ReadonlyArray<IdeaProposal>> {
    const ideaProposals: ReadonlyArray<IdeaProposal> = await fetchIdeaProposalsFromEthereum(
        demergenceContractAddress,
        demergenceContractABI,
        ethereumProvider
    );
    return await fetchIdeaProposalsContents(ideaProposals);
}

async function fetchIdeaProposalsFromEthereum(
    demergenceContractAddress: string,
    demergenceContractABI: Array<string>,
    ethereumProvider: Readonly<ethers.providers.Web3Provider>
): Promise<ReadonlyArray<IdeaProposal>> {
    const demergenceContract: Readonly<ethers.Contract> = new ethers.Contract(demergenceContractAddress, demergenceContractABI, ethereumProvider);

    const ideaProposalsString: string = await demergenceContract.getProposals();
    const ideaProposals: ReadonlyArray<IdeaProposal> = JSON.parse(ideaProposalsString);

    return ideaProposals;
}

async function fetchIdeaProposalsContents(ideaProposals: ReadonlyArray<IdeaProposal>): Promise<ReadonlyArray<IdeaProposal>> {
    return await Promise.all(ideaProposals.map(async (ideaProposal) => {
        return {
            ...ideaProposal,
            contents: await fetchIdeaProposalContents(ideaProposal)
        };
    }));
}

async function fetchIdeaProposalContents(ideaProposal: Readonly<IdeaProposal>): Promise<string> {

    if (ideaProposal.retrievalType === 'SWARM') {
        return await fetchSwarmContents(ideaProposal.retrievalUri);        
    }

    if (ideaProposal.retrievalType === 'IPFS') {
        return await fetchIPFSContents(ideaProposal.retrievalUri);
    }

    if (ideaProposal.retrievalType === 'HTTPS') {
        return await fetchHTTPSContents(ideaProposal.retrievalUri);
    }

    return 'NOT_SET';
}

async function fetchSwarmContents(contentHash: string): Promise<string> {
    const response = await window.fetch(`https://swarm-gateways.net/bzz:/${contentHash}/`);
    return await response.text();
}

async function fetchIPFSContents(contentHash: string): Promise<string> {
    throw new Error('IPFS not implemented');
}

async function fetchHTTPSContents(url: string): Promise<string> {
    const response = await window.fetch(url);
    return await response.text();
}