export const DEMERGENCE_CONTRACT_ADDRESS = '0x570c0B6440B9A11da0f99e7E62c946C70ED97837';

export const DEMERGENCE_CONTRACT_ABI = [
    'function proposeIdea(string memory name, string memory retrievalType, string memory retrievalUri) public',
    'function getProposals() public view returns (string memory)',
    'function voteForIdeaProposal(string memory ideaName) public',
    'function voteAgainstIdeaProposal(string memory ideaName) public',
    'function executeIdeaProposal(string memory ideaName) public'
];

export const MERG_CONTRACT_ADDRESS = '0x6D6fc0931cAc5fc243ADc49dE94b9824072286f5';

export const ETHEREUM_NETWORK = 'ropsten';