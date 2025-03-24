import React, { useState, useEffect } from "react";
import { ethers, parseEther, formatEther } from "ethers";
import { BrowserProvider } from "ethers";  // For MetaMask provider
import { JsonRpcProvider } from "ethers";  // For RPC connections


import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contractConfig";

function App() {
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);

    // Car listing form state
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [price, setPrice] = useState("");
    const [metadataURI, setMetadataURI] = useState("");

    // Connect to MetaMask
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const provider = new BrowserProvider(window.ethereum);
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const signer = provider.getSigner();
                const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
                
                setAccount(await signer.getAddress());
                setContract(contractInstance);
                console.log("Wallet Connected:", await signer.getAddress());
            } catch (error) {
                console.error("Connection Error:", error);
            }
        } else {
            alert("Please install MetaMask.");
        }
    };

    // Fetch cars from contract
    const fetchCars = async () => {
        if (!contract) return;
        setLoading(true);
        let carList = [];
        
        for (let carId = 1; carId <= 10; carId++) {  // Adjust limit as needed
            try {
                let car = await contract.getCar(carId);
                if (car.listed) {
                    carList.push({
                        id: car.id.toNumber(),
                        make: car.make,
                        model: car.model,
                        year: car.year.toNumber(),
                        price: formatEther(car.price) + " ETH",
                    });
                }
            } catch (error) {
                break;  // Stop when invalid carId is reached
            }
        }
        setCars(carList);
        setLoading(false);
    };

    // List a new car
    const listCar = async () => {
        if (!contract) return alert("Connect wallet first!");
        try {
            const tx = await contract.listCar(make, model, year, parseEther(price),
            formatEther(price)
            , metadataURI);
            await tx.wait();
            alert("Car listed successfully!");
            fetchCars();
        } catch (error) {
            console.error("Listing Failed:", error);
        }
    };

    // Buy a car
    const buyCar = async (carId, price) => {
        if (!contract) return alert("Connect wallet first!");
        try {
            const tx = await contract.buyCar(carId, { value: parseEther(price)
               });
            await tx.wait();
            alert("Car purchased successfully!");
            fetchCars();
        } catch (error) {
            console.error("Purchase Failed:", error);
        }
    };

    useEffect(() => {
        if (contract) fetchCars();
    }, [contract]);

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>🚗 Car NFT Marketplace</h1>
            {!account ? (
                <button onClick={connectWallet}>🔗 Connect Wallet</button>
            ) : (
                <p>Connected as: {account}</p>
            )}

            <h2>List Your Car</h2>
            <input type="text" placeholder="Make" onChange={(e) => setMake(e.target.value)} />
            <input type="text" placeholder="Model" onChange={(e) => setModel(e.target.value)} />
            <input type="number" placeholder="Year" onChange={(e) => setYear(e.target.value)} />
            <input type="text" placeholder="Price (ETH)" onChange={(e) => setPrice(e.target.value)} />
            <input type="text" placeholder="Metadata URI" onChange={(e) => setMetadataURI(e.target.value)} />
            <button onClick={listCar}>🚀 List Car</button>

            <h2>Available Cars</h2>
            {loading ? <p>Loading...</p> : (
                cars.map((car) => (
                    <div key={car.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
                        <p>{car.make} {car.model} ({car.year})</p>
                        <p>Price: {car.price}</p>
                        <button onClick={() => buyCar(car.id, car.price)}>💰 Buy</button>
                    </div>
                ))
            )}
        </div>
    );
}

export default App;
