import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';

// Update with the contract address logged out to CLI when it was deployed
const greeterAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

function App() {
  // storing greeting in local storage
  const [greeting, setGreetingValue] = useState();

  // requesting access to the user's Metamask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccount' });
  }

  // call the smart contract, read the current greeting value
  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  // calling the smart contract and sending an update
  async function setGreeting() {
    if (!greeting) return
    if (typeof window.ethereum != 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()
      fetchGreeting()
    } 
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder='Set Greeting' />
      </header>
    </div>
  );
}

export default App;
