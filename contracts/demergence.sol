pragma solidity ^0.6.6;

contract Demergence {
    
    uint public constant ideaAcceptedAward = 100e18;
    
    mapping (string => IdeaProposal) public ideaProposals;
    
    string[] public ideaProposalNames;
    
    // TODO the proposals need a unique identifier
    // TODO do we need a timestamp or something?
    struct IdeaProposal {
        string name; // TODO perhaps we shouldn't save the name here, to save on gas
        string retrievalType;
        string retrievalUri;
        bool accepted;
        uint votes;
    }
    
    function proposeIdea(string memory name, string memory retrievalType, string memory retrievalUri) public {
        IdeaProposal memory ideaProposal = IdeaProposal({
            name: name,
            retrievalType: retrievalType,
            retrievalUri: retrievalUri,
            accepted: false,
            votes: 0
        });
        
        ideaProposals[name] = ideaProposal;
        ideaProposalNames.push(name);
    }   
    
    function getProposals() public view returns (string memory) {
        string memory json = '[';
        
        for (uint256 i=0; i < ideaProposalNames.length; i++) {
            IdeaProposal memory ideaProposal = ideaProposals[ideaProposalNames[i]];

            json = string(abi.encodePacked(json, '{"name":"', ideaProposal.name, '","retrievalType":"', ideaProposal.retrievalType, '","retrievalUri":"', ideaProposal.retrievalUri, '"}', i != ideaProposalNames.length - 1 ? ',' : ''));
        }
        
        json = string(abi.encodePacked(json, ']'));
        
        return json;
    }
    
    // function voteOnIdea() {
        
    // }
}