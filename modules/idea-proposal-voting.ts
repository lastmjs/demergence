import { IdeaProposal } from '../index.d';
import { ethers } from 'ethers';

export async function voteOnIdeaProposal(
    demergenceContractAddress: string,
    demergenceContractABI: Array<string>,
    ethereumProvider: Readonly<ethers.providers.Web3Provider>,
    ideaProposal: Readonly<IdeaProposal>,
    support: boolean
) {
    await (window as any).ethereum.enable();
    const demergenceContract: Readonly<ethers.Contract> = new ethers.Contract(demergenceContractAddress, demergenceContractABI, ethereumProvider.getSigner());

    if (support === true) {
        const transactionResponse = await demergenceContract.voteForIdeaProposal(ideaProposal.name);

        console.log('transactionResponse', transactionResponse);
    }
    else {
        const transactionResponse = await demergenceContract.voteAgainstIdeaProposal(ideaProposal.name);

        console.log('transactionResponse', transactionResponse);
    }
}

export async function executeIdeaProposal(
    demergenceContractAddress: string,
    demergenceContractABI: Array<string>,
    ethereumProvider: Readonly<ethers.providers.Web3Provider>,
    ideaProposal: Readonly<IdeaProposal>
) {
    await (window as any).ethereum.enable();
    const demergenceContract: Readonly<ethers.Contract> = new ethers.Contract(demergenceContractAddress, demergenceContractABI, ethereumProvider.getSigner());

    const transactionResponse = await demergenceContract.executeIdeaProposal(ideaProposal.name);

    console.log('transactionResponse', transactionResponse);
}