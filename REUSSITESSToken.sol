// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract REUSSITESSToken is ERC20 {
    constructor(
        address owner,
        address admin
    ) ERC20("REUSSITESS Token", "REUSS") {
        _mint(owner, 1000000000 * 10**decimals());
        _transfer(owner, admin, 12708649 * 10**decimals());
    }
}
