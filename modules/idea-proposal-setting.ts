import { IdeaProposal } from '../index.d';
import { ethers } from 'ethers';

export async function setIdeaProposal(
    demergenceContractAddress: string,
    demergenceContractABI: Array<string>,
    ethereumProvider: Readonly<ethers.providers.Web3Provider>,
    ideaProposal: Readonly<IdeaProposal>
) {    
    const retrievalUri: string = await getRetrievalUri(ideaProposal);
    await setIdeaProposalOnEthereum(
        demergenceContractAddress,
        demergenceContractABI,
        ethereumProvider, {
            ...ideaProposal,
            retrievalUri
        }
    );
}

async function getRetrievalUri(ideaProposal: Readonly<IdeaProposal>): Promise<string> {
    if (ideaProposal.retrievalType === 'SWARM') {
        return await setIdeaProposalOnSwarm(ideaProposal);
    }

    if (ideaProposal.retrievalType === 'IPFS') {
        return await setIdeaProposalOnIPFS(ideaProposal);
    }

    if (ideaProposal.retrievalType === 'HTTPS') {
        return await setIdeaProposalOnHTTPS(ideaProposal);
    }

    throw new Error(`${ideaProposal.retrievalType} is not supported`);
}

async function setIdeaProposalOnEthereum(
    demergenceContractAddress: string,
    demergenceContractABI: Array<string>,
    ethereumProvider: Readonly<ethers.providers.Web3Provider>,
    ideaProposal: Readonly<IdeaProposal>
) {
    await (window as any).ethereum.enable();
    const demergenceContract: Readonly<ethers.Contract> = new ethers.Contract(demergenceContractAddress, demergenceContractABI, ethereumProvider.getSigner());

    const transactionResponse = await demergenceContract.proposeIdea(ideaProposal.name, ideaProposal.retrievalType, ideaProposal.retrievalUri);

    console.log('transactionResponse', transactionResponse);
}

async function setIdeaProposalOnSwarm(ideaProposal: Readonly<IdeaProposal>): Promise<string> {
    const response = await window.fetch(`https://swarm-gateways.net/bzz:/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: ideaProposal.contents
    });

    return await response.text();
}

async function setIdeaProposalOnIPFS(ideaProposal: Readonly<IdeaProposal>): Promise<string> {
    throw new Error('IPFS not implemented');
}

async function setIdeaProposalOnHTTPS(ideaProposal: Readonly<IdeaProposal>): Promise<string> {
    throw new Error('HTTPS not implemented');

}