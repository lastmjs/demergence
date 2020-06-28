export const DEMERGENCE_CONTRACT_ADDRESS = '0x540BD49078DbB171f5013f3e0aB7A0C83f451954';

export const DEMERGENCE_CONTRACT_ABI = [
    'function proposeIdea(string memory name, string memory retrievalType, string memory retrievalUri) public',
    'function getProposals() public view returns (string memory)',
    'function voteForIdeaProposal(string memory ideaName) public',
    'function voteAgainstIdeaProposal(string memory ideaName) public',
    'function executeIdeaProposal(string memory ideaName) public'
];

export const MERG_CONTRACT_ADDRESS = '0x4113546d5Df7Be065774c9CD5984341b4BdE1f30';

export const ETHEREUM_NETWORK = 'ropsten';