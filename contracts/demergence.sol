// Influenced by Compound's Governor Alpha: https://github.com/compound-finance/compound-protocol/blob/master/contracts/Governance/GovernorAlpha.sol

/*
 Copyright 2020 Compound Labs, Inc.
 Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// TODO look into all types

pragma solidity ^0.6.6;

contract Demergence {
    
    string public constant name = 'Demergence';
    
    uint public constant ideaProposalMergAward = 100e18;
    uint public constant ideaProposalMergThreshold = 100e18;
    uint public constant ideaProposalPeriod = 1 days;
    uint public constant ideaProposalMergQuorum = 50000e18; // 1,000,000 Merg total supply / 50,000 = 5% of Merg necessary for a quorum
    
    mapping (string => IdeaProposal) public ideaProposals;
    
    string[] public ideaProposalNames;
    
    MergInterface public Merg;
    
    // TODO the proposals need a unique identifier
    // TODO do we need a timestamp or something?
    struct IdeaProposal {
        string name; // TODO perhaps we shouldn't save the name here, to save on gas
        string retrievalType;
        string retrievalUri;
        bool accepted;
        bool resolved;
        uint forVotes;
        uint againstVotes;
        uint startTime;
        mapping (address => Receipt) receipts;
    }
    
    struct Receipt {
        bool support;
        uint256 votes; // TODO compound has this set to uint96...we might want to check on this
    }
    
    constructor(address mergAddress) public {
        Merg = MergInterface(mergAddress);
    }
    
    function proposeIdea(string memory ideaName, string memory retrievalType, string memory retrievalUri) public {
        
        require(Merg.balanceOf(msg.sender) >= ideaProposalMergThreshold, "Demergence::proposeIdea: proposer votes below proposal threshold");
        
        IdeaProposal memory ideaProposal = IdeaProposal({
            name: ideaName,
            retrievalType: retrievalType,
            retrievalUri: retrievalUri,
            accepted: false,
            resolved: false,
            forVotes: 0,
            againstVotes: 0,
            startTime: now
        });
        
        ideaProposals[ideaName] = ideaProposal;
        ideaProposalNames.push(ideaName);
    }   
    
    function getProposals() public view returns (string memory) {
        string memory json = '[';
        
        for (uint256 i=0; i < ideaProposalNames.length; i++) {
            IdeaProposal memory ideaProposal = ideaProposals[ideaProposalNames[i]];

            // TODO figure out how to convert integers to strings
            json = string(abi.encodePacked(
                json,
                '{"name":"',
                ideaProposal.name,
                '","retrievalType":"',
                ideaProposal.retrievalType,
                '","retrievalUri":"',
                ideaProposal.retrievalUri,
                '","accepted":',
                ideaProposal.accepted == true ? 'true' : 'false',
                ',"resolved":',
                ideaProposal.resolved == true ? 'true' : 'false',
                ',"forVotes":',
                uint2str(ideaProposal.forVotes),
                ',"againstVotes":',
                uint2str(ideaProposal.againstVotes),
                ',"startTime":',
                uint2str(ideaProposal.startTime),
                '}',
                i != ideaProposalNames.length - 1 ? ',' : ''
            ));
        }
        
        json = string(abi.encodePacked(json, ']'));
        
        return json;
    }
    
    // TODO combine this function with voteAgainstIdeaProposal, abstract it out better
    function voteForIdeaProposal(string memory ideaName) public {
        IdeaProposal storage ideaProposal = ideaProposals[ideaName];
        
        // TODO obviously we need to test this
        require(now < ideaProposal.startTime + ideaProposalPeriod, 'Demergence::voteForIdeaProposal: voting is closed');
        
        Receipt storage receipt = ideaProposal.receipts[msg.sender];
        
        require(receipt.votes == 0, 'Demergence::voteForIdeaProposal: voter already voted');
        
        // TODO really check on types and conversions here
        uint256 votes = Merg.balanceOf(msg.sender);
        
        ideaProposal.forVotes = add256(ideaProposal.forVotes, votes);
        
        receipt.support = true;
        receipt.votes = votes;
    }
    
    function voteAgainstIdeaProposal(string memory ideaName) public {
        IdeaProposal storage ideaProposal = ideaProposals[ideaName];
        
        // TODO obviously we need to test this
        // require(now < ideaProposal.startTime + ideaProposalPeriod, 'Demergence::voteAgainstIdeaProposal: voting is closed');
        
        Receipt storage receipt = ideaProposal.receipts[msg.sender];
        
        require(receipt.votes == 0, 'Demergence::voteAgainstIdeaProposal: voter already voted');
        
        // TODO really check on types and conversions here
        uint256 votes = Merg.balanceOf(msg.sender);
        
        ideaProposal.againstVotes = add256(ideaProposal.againstVotes, votes);
        
        receipt.support = true;
        receipt.votes = votes;
    }
    
    function executeIdeaProposal(string memory ideaName) public {
        IdeaProposal storage ideaProposal = ideaProposals[ideaName];
        
        require(ideaProposal.resolved == false, 'Demergence::executeIdeaProposal: proposal has already been resolved');
        
        if (
            ideaProposal.forVotes > ideaProposal.againstVotes &&
            ideaProposal.forVotes >= ideaProposalMergThreshold
            // now >= ideaProposal.startTime + ideaProposalPeriod
        ) {
            ideaProposal.accepted = true;
        }

        ideaProposal.resolved = true;
    }
    
    function add256(uint256 a, uint256 b) internal pure returns (uint) {
        uint c = a + b;
        require(c >= a, "addition overflow");
        return c;
    }

    function sub256(uint256 a, uint256 b) internal pure returns (uint) {
        require(b <= a, "subtraction underflow");
        return a - b;
    }
    
    /*
        ORACLIZE_API
        Copyright (c) 2015-2016 Oraclize SRL
        Copyright (c) 2016 Oraclize LTD
        Permission is hereby granted, free of charge, to any person obtaining a copy
        of this software and associated documentation files (the "Software"), to deal
        in the Software without restriction, including without limitation the rights
        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the Software is
        furnished to do so, subject to the following conditions:
        The above copyright notice and this permission notice shall be included in
        all copies or substantial portions of the Software.
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
        THE SOFTWARE.
    */
    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = byte(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
}

// TODO if I make this a contract and I import it, I wonder if I can get around the gas estimate issues
interface MergInterface {
    function balanceOf(address account) external view returns (uint);
}