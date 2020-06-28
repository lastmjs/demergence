import { html, render as litRender } from 'lit-html';
import { createObjectStore } from 'reduxular';
import { IdeaProposal } from '../index.d';
import { fetchIdeaProposals } from '../modules/idea-proposal-fetching';
import { setIdeaProposal } from '../modules/idea-proposal-setting';
import {
    DEMERGENCE_CONTRACT_ADDRESS,
    DEMERGENCE_CONTRACT_ABI
} from '../modules/constants';
import { ethereumProvider } from '../modules/ethereum';
import { BigNumber } from 'bignumber.js';
import {
    voteOnIdeaProposal,
    executeIdeaProposal
} from '../modules/idea-proposal-voting';

type State = {
    readonly ideaProposals: ReadonlyArray<IdeaProposal>;
};

const InitialState: Readonly<State> = {
    ideaProposals: []
};

class MERGApp extends HTMLElement {
    readonly store = createObjectStore(InitialState, (state: Readonly<State>) => litRender(this.render(state), this), this);

    async connectedCallback() {
        const ideaProposals: ReadonlyArray<IdeaProposal> = await fetchIdeaProposals(
            DEMERGENCE_CONTRACT_ADDRESS,
            DEMERGENCE_CONTRACT_ABI,
            ethereumProvider
        );
    
        this.store.ideaProposals = ideaProposals;
    }

    async submitIdeaProposal() {
        // TODO store these values in the state, automatically update from input
        const proposalName: string = (this.querySelector('#proposal-name-input') as any).value;
        const proposalContents: string = (this.querySelector('#proposal-contents-input') as any).value;

        const ideaProposal: Readonly<IdeaProposal> = {
            name: proposalName,
            retrievalType: 'SWARM',
            retrievalUri: 'NOT_SET',
            accepted: false,
            resolved: false,
            forVotes: 0,
            againstVotes: 0,
            startTime: 0,
            contents: proposalContents
        };

        await setIdeaProposal(
            DEMERGENCE_CONTRACT_ADDRESS,
            DEMERGENCE_CONTRACT_ABI,
            ethereumProvider,
            ideaProposal
        );

        (this.querySelector('#proposal-name-input') as any).value = '';
        (this.querySelector('#proposal-contents-input') as any).value = '';
    }

    async voteForIdeaProposal(ideaProposal: Readonly<IdeaProposal>) {
        await voteOnIdeaProposal(
            DEMERGENCE_CONTRACT_ADDRESS,
            DEMERGENCE_CONTRACT_ABI,
            ethereumProvider,
            ideaProposal,
            true
        );
    }

    async voteAgainstIdeaProposal(ideaProposal: Readonly<IdeaProposal>) {
        await voteOnIdeaProposal(
            DEMERGENCE_CONTRACT_ADDRESS,
            DEMERGENCE_CONTRACT_ABI,
            ethereumProvider,
            ideaProposal,
            false
        );
    }

    async resolveVotingForIdeaProposal(ideaProposal: Readonly<IdeaProposal>) {
        await executeIdeaProposal(
            DEMERGENCE_CONTRACT_ADDRESS,
            DEMERGENCE_CONTRACT_ABI,
            ethereumProvider,
            ideaProposal
        );
    }

    render(state: Readonly<State>) {
        return html`
            <h1>Demergence</h1>

            <div>
                <a href="/oss-attribution/attribution.txt" target="_blank">Open Source</a>
                <br>
                <br>
            </div>

            <div>
                <div>Make a proposal:</div>
                
                <div>
                    Proposal name: <input id="proposal-name-input" type="text">
                </div>

                <div>
                    Proposal contents: <input id="proposal-contents-input" type="text">
                </div>

                <div>
                    <button @click=${() => this.submitIdeaProposal()}>Submit proposal</button>
                </div>
            </div>

            <br>

            <h2>Accepted Proposals</h2>

            <div>
                ${state.ideaProposals.filter((ideaProposal: Readonly<IdeaProposal>) => ideaProposal.resolved && ideaProposal.accepted).map((ideaProposal: Readonly<IdeaProposal>) => {
                    return html`
                        <div>${ideaProposal.name}</div>
                        <br>
                        <div>Proposed at: ${new Date(ideaProposal.startTime * 1000).toLocaleString()}</div>
                        <br>
                        <div>Votes for: ${new BigNumber(ideaProposal.forVotes).dividedBy(10**18)}</div>
                        <div>Votes against: ${new BigNumber(ideaProposal.againstVotes).dividedBy(10**18)}</div>
                        <br>
                        <div>${ideaProposal.contents}</div>
                        <br>
                    `;
                })}

                ${state.ideaProposals.filter((ideaProposal: Readonly<IdeaProposal>) => ideaProposal.resolved && ideaProposal.accepted).length === 0 ? 'None' : ''}
            </div>

            <br>

            <h2>Rejected Proposals</h2>

            <div>
                ${state.ideaProposals.filter((ideaProposal: Readonly<IdeaProposal>) => ideaProposal.resolved && !ideaProposal.accepted).map((ideaProposal: Readonly<IdeaProposal>) => {
                    return html`
                        <div>${ideaProposal.name}</div>
                        <br>
                        <div>Proposed at: ${new Date(ideaProposal.startTime * 1000).toLocaleString()}</div>
                        <br>
                        <div>Votes for: ${new BigNumber(ideaProposal.forVotes).dividedBy(10**18)}</div>
                        <div>Votes against: ${new BigNumber(ideaProposal.againstVotes).dividedBy(10**18)}</div>
                        <br>
                        <div>${ideaProposal.contents}</div>
                        <br>
                    `;
                })}

                ${state.ideaProposals.filter((ideaProposal: Readonly<IdeaProposal>) => ideaProposal.resolved && !ideaProposal.accepted).length === 0 ? 'None' : ''}
            </div>

            <br>

            <h2>Pending Proposals</h2>
        
            <div>
                ${state.ideaProposals.filter((ideaProposal: Readonly<IdeaProposal>) => !ideaProposal.resolved && !ideaProposal.accepted).map((ideaProposal: Readonly<IdeaProposal>) => {
                    return html`
                        <div>${ideaProposal.name}</div>
                        <br>
                        <div>Proposed at: ${new Date(ideaProposal.startTime * 1000).toLocaleString()}</div>
                        <br>
                        <div>Votes for: ${new BigNumber(ideaProposal.forVotes).dividedBy(10**18)}</div>
                        <div>Votes against: ${new BigNumber(ideaProposal.againstVotes).dividedBy(10**18)}</div>
                        <br>
                        <div>${ideaProposal.contents}</div>
                        <br>
                        <div>
                            <button @click=${() => this.voteForIdeaProposal(ideaProposal)} style="color: green">Vote for</button>
                            <button @click=${() => this.voteAgainstIdeaProposal(ideaProposal)} style="color: red">Vote against</button>
                            <button @click=${() => this.resolveVotingForIdeaProposal(ideaProposal)}>Resolve voting</button>
                        </div>
                        <br>
                    `;
                })}

                ${state.ideaProposals.filter((ideaProposal: Readonly<IdeaProposal>) => !ideaProposal.accepted).length === 0 ? 'None' : ''}
            </div>
        `;
    }
}

window.customElements.define('merg-app', MERGApp);