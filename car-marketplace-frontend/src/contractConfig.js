export const CONTRACT_ADDRESS = "0xB1BDBdedaCd4f888Fae0676Be4CFe0Fc978177ad";

export const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "carId", "type": "uint256" }
        ],
        "name": "buyCar",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "make", "type": "string" },
            { "internalType": "string", "name": "model", "type": "string" },
            { "internalType": "uint256", "name": "year", "type": "uint256" },
            { "internalType": "uint256", "name": "price", "type": "uint256" },
            { "internalType": "string", "name": "metadataURI", "type": "string" }
        ],
        "name": "listCar",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "carId", "type": "uint256" }],
        "name": "getCar",
        "outputs": [
            {
                "components": [
                    { "internalType": "uint256", "name": "id", "type": "uint256" },
                    { "internalType": "string", "name": "make", "type": "string" },
                    { "internalType": "string", "name": "model", "type": "string" },
                    { "internalType": "uint256", "name": "year", "type": "uint256" },
                    { "internalType": "uint256", "name": "price", "type": "uint256" },
                    { "internalType": "bool", "name": "listed", "type": "bool" }
                ],
                "internalType": "struct CarMarketplace.Car",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
