export type IdeaProposal = {
    readonly name: string;
    readonly retrievalType: 'SWARM' | 'IPFS' | 'HTTPS'; // TODO decide on the best way to have retrieval types
    readonly retrievalUri: string;
    readonly accepted: boolean;
    readonly resolved: boolean;
    readonly forVotes: number;
    readonly againstVotes: number;
    readonly startTime: number;
    readonly contents: string | 'NOT_SET';
};