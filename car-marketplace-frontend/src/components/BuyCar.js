import { useAccount, useContractWrite } from "wagmi";
import { abi } from "../contract/CarMarketplace.json";

const contractAddress = "0xB1BDBdedaCd4f888Fae0676Be4CFe0Fc978177ad";

export default function BuyCar({ carId, price }) {
    const { address } = useAccount();
    const { write } = useContractWrite({
        address: contractAddress,
        abi,
        functionName: "buyCar",
    });

    const handleBuy = async () => {
        await write({
            args: [carId],
            value: price, // Convert to Wei if needed
        });
    };

    return <button onClick={handleBuy}>Buy Car</button>;
}
