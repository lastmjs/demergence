/*
 Copyright 2020 Compound Labs, Inc.
 Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

pragma solidity ^0.6.6;

contract Merg {
    string public constant name = "Merg";
    
    string public constant symbol = "MERG";
    
    uint8 public constant decimals = 18; // TODO research tradeoffs with decimals
    
    uint public constant totalSupply = 1000000e18;
    
    mapping (address => uint96) internal balances;
    
    event Transfer(address indexed from, address indexed to, uint256 amount);
    
    // TODO use mint and burn events, or consider it instead of transferring to or from the 0 address
    constructor() public {
        // balances[account] = uint96(totalSupply); // TODO figure out initial supply
        balances[address(0xC41309B80C7d98570d7113091fa16f7e09d01a14)] = uint96(250000e18); // TODO this will be my personal address
        balances[address(0xC41309B80C7d98570d7113091fa16f7e09d01a14)] = uint96(750000e18); // TODO this will be the demergence governance contract
        // TODO when creating the initial contract on main net, I'm thinking we can put all of the early adopter addresses in here statically
        emit Transfer(address(0), account, totalSupply);
    }
    
    function balanceOf(address account) external view returns (uint) {
        return balances[account];
    }

    function transfer(address dst, uint rawAmount) external returns (bool) {
        uint96 amount = safe96(rawAmount, "Merg::transfer: amount exceeds 96 bits");
        _transferTokens(msg.sender, dst, amount);
        return true;
    }
    
    function _transferTokens(address src, address dst, uint96 amount) internal {
        require(src != address(0), "Merg::_transferTokens: cannot transfer from the zero address");
        require(dst != address(0), "Merg::_transferTokens: cannot transfer to the zero address");

        balances[src] = sub96(balances[src], amount, "Merg::_transferTokens: transfer amount exceeds balance");
        balances[dst] = add96(balances[dst], amount, "Merg::_transferTokens: transfer amount overflows");
        emit Transfer(src, dst, amount);
    }
    
    function safe96(uint n, string memory errorMessage) internal pure returns (uint96) {
        require(n < 2**96, errorMessage);
        return uint96(n);
    }

    function add96(uint96 a, uint96 b, string memory errorMessage) internal pure returns (uint96) {
        uint96 c = a + b;
        require(c >= a, errorMessage);
        return c;
    }

    function sub96(uint96 a, uint96 b, string memory errorMessage) internal pure returns (uint96) {
        require(b <= a, errorMessage);
        return a - b;
    }
}