import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
// import {  useRouter } from "next/Navigation";

export default function useMetaMask() {
    const [account, setAccount] = useState(null);
    const [verified, setVerified] = useState(false);
    const router = useRouter();
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                setAccount(accounts.length ? accounts[0] : null);
                setVerified(false);
            });
        }
    }, []);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setAccount(accounts[0]);
                setVerified(true);
                localStorage.setItem("wallet", accounts[0]);
            } catch (error) {
                console.error("Connection failed:", error);
            }

        } else {
            console.error("MetaMask not found");
            router.push("/verify-meta-mask-ajkl47813290-csadnl78913240");
        }
    };

    return { account, verified, connectWallet };
}
