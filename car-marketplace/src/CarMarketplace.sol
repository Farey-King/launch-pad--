// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarMarketplace is ERC721URIStorage, Ownable {
    struct Car {
        uint256 id;
        string make;
        string model;
        uint256 year;
        uint256 price;
        bool listed;
    }

    uint256 private _nextCarId = 1;
    mapping(uint256 => Car) public cars;
    mapping(uint256 => address) public carOwners;

    event CarListed(uint256 indexed carId, string make, string model, uint256 price);
    event CarSold(uint256 indexed carId, address indexed buyer, uint256 price);

    // ✅ Fix: Pass `msg.sender` to Ownable constructor
    constructor() ERC721("CarNFT", "CARNFT") Ownable(msg.sender) {}

    function listCar(
        string memory make, 
        string memory model, 
        uint256 year, 
        uint256 price, 
        string memory metadataURI
    ) external {
        uint256 carId = _nextCarId++;
        _safeMint(msg.sender, carId);
        _setTokenURI(carId, metadataURI);

        cars[carId] = Car(carId, make, model, year, price, true);
        carOwners[carId] = msg.sender;

        emit CarListed(carId, make, model, price);
    }

    function buyCar(uint256 carId) external payable {
        require(cars[carId].listed, "Car not listed for sale");
        require(msg.value >= cars[carId].price, "Insufficient funds");

        address seller = ownerOf(carId);
        payable(seller).transfer(msg.value);
        _transfer(seller, msg.sender, carId);

        cars[carId].listed = false;
        carOwners[carId] = msg.sender;

        emit CarSold(carId, msg.sender, cars[carId].price);
    }

    function getCar(uint256 carId) external view returns (Car memory) {
        return cars[carId];
    }
}
