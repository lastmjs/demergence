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

            <div>Proposals</div>
        
            <br>

            <div>
                ${state.ideaProposals.map((ideaProposal: Readonly<IdeaProposal>) => {
                    return html`
                        <div>${ideaProposal.name}</div>
                        <div>${ideaProposal.contents}</div>
                        <div>
                            <button style="color: green">Accept Proposal</button>
                            <button style="color: red">Reject Proposal</button>
                        </div>
                        <br>
                    `;
                })}
            </div>
        `;
    }
}

window.customElements.define('merg-app', MERGApp);