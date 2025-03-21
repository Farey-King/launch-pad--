import { useState, useEffect } from "react";
import { client } from "../lib/viem";
import { abi } from "../contract/CarMarketplace.json";

const contractAddress = "0xB1BDBdedaCd4f888Fae0676Be4CFe0Fc978177ad";

export default function CarList() {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        async function fetchCars() {
            const carIds = [1, 2, 3]; // Fetch IDs dynamically
            const carData = await Promise.all(
                carIds.map(async (id) => {
                    return await client.readContract({
                        address: contractAddress,
                        abi,
                        functionName: "getCar",
                        args: [id],
                    });
                })
            );
            setCars(carData);
        }
        fetchCars();
    }, []);

    return (
        <div>
            {cars.map((car, index) => (
                <div key={index}>
                    <h3>{car.make} {car.model} ({car.year})</h3>
                    <p>Price: {car.price.toString()} ETH</p>
                </div>
            ))}
        </div>
    );
}

