import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function useMetaMask() {
    const [account, setAccount] = useState(null);
    const [verified, setVerified] = useState(false);
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
            alert("MetaMask is not installed!");
        }
    };

    return { account, verified, connectWallet };
}
