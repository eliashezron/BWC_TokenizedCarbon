import React, {useState, useEffect } from 'react';
import SelectTokenModal from '../components/selectModal';
import tokenlist from '../data/tokens.json'
import qs from 'qs'
import { useSigner , useAccount} from "wagmi";
import {ethers, BigNumber, Signer} from 'ethers'
import abi from "./abi.json"

interface Coin {
  id: string;
  symbol: string;
  name: string;
  platforms: {
    celo: string;
  };
}

function App() {
  const { data: signer, isError, isLoading } = useSigner();
  const {address} = useAccount()
  const [isOpen, setIsOpen] = useState(false);
  const [tokenFrom, setTokenFrom] = useState<string>('celo');
  const [tokenIn, setTokenIn] = useState<Coin | null>();
  const [tokenTo, setTokenTo] = useState<string>("NCT");
  const [tokenOut, setTokenOut] = useState<Coin | null>();
  const [choice, setChoice] = useState<string>('to');
  const [tokens, setTokens] = useState<Coin[]>(tokenlist);


  const [amountEntered, setAmountEntered] = useState<number>(0.0);
  const [amountTo, setAmountTo] = useState<number | null>(null);
  const [gasPrice, setGasPrice] = useState<number>(0.0);

  useEffect(() => {
    const defaultToken = tokens.find(token => token.symbol === "celo");
    if (defaultToken) {
      setTokenOut(defaultToken);
      
    }
    const defaultTokenOut = tokens.find(token => token.symbol === "NCT");
    if (defaultTokenOut) {
      setTokenIn(defaultTokenOut);
      
    }
  }, [tokens]);
  

  const open = (choiceType: string) => {
    setChoice(choiceType);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };
  
  const selectToken = (token: Coin, choice: string) => {
    if (choice === 'from') {
      setTokenFrom(token.name);
      setTokenOut(token)
      console.log(tokenIn)
      
    } else {
      setTokenTo(token.name);
      setTokenIn(token)
   
      if(tokenOut?.name){ console.log(tokenOut.platforms.celo)
      }
    }
    setIsOpen(false);
  };

  const headers = {"0x-api-key": '501ab300-9f9e-46e2-bc63-328dfa7ab415'}
  const getPrice = async () => {
    if (!tokenIn?.symbol || !tokenOut?.symbol || !amountEntered) return
      // set the params
    
      let amount = (amountEntered) * 10 ** 18
      const params = {
        sellToken: tokenOut.platforms.celo,
        buyToken: tokenIn.platforms.celo,
        sellAmount: amount,
      }
      try {
          // Fetch the swap price.
      const response = await fetch(
        `https://celo.api.0x.org/swap/v1/price?${qs.stringify(params)}`, {headers}
      )
    // Await and parse the JSON response
    const priceResult = await response.json()
    console.log('Price: ', priceResult)

    const pricesConverted = priceResult.buyAmount / 10 ** 18
    setAmountTo(pricesConverted)
    console.log('Price to: ', pricesConverted)

    setGasPrice(priceResult.estimatedGas)
      } catch (error) {
        console.log(error)
      }
     
  }
  const getQuote = async () => {
    if (!tokenIn?.symbol || !tokenOut?.symbol || !amountEntered||!address) return
      // set the params
    
      let amount = (amountEntered) * 10 ** 18

      
      const addr = address.toString();
      
      const params = {
        sellToken: tokenOut.platforms.celo,
        buyToken: tokenIn.platforms.celo,
        sellAmount: amount,
        takerAddress: addr,
      }
  
      // Fetch the quote price.
     
        const response = await fetch(
          `https://celo.api.0x.org/swap/v1/quote?${qs.stringify(params)}`, {headers}
        )
        const swapQuoteJSON = await response.json();
        console.log("Quote: ", swapQuoteJSON);
  
      const pricesConverted = swapQuoteJSON.buyAmount / 10 ** 18
      setAmountTo(pricesConverted)
      console.log('Price to: ', pricesConverted)
      setGasPrice(swapQuoteJSON.estimatedGas)
    
     return swapQuoteJSON
  }
  const swap = async () => {

    if (!tokenIn?.symbol || !tokenOut?.symbol || !amountEntered || !signer) return
 
    const tokenFromAddress = tokenOut.platforms.celo

    // Create the contract instance
    const tokenContract = new ethers.Contract( tokenFromAddress,abi, signer)
    console.log('Contract instance set-up: ', tokenContract)

    // Get the Max Approved amount of the token and convert it using BigNumber
    const maxApproval = ethers.constants.MaxUint256;
    console.log('approval amount: ', maxApproval)
    const  swapQuoteJSON = await getQuote();
    const approveTx = await tokenContract.approve(
      swapQuoteJSON.allowanceTarget,
      maxApproval
    );

    console.log(approveTx.hash)

    // Grant the spender address approval to spend the user's tokens

}


  return (
    <>
    {tokenIn?.symbol === tokenOut?.symbol && (
          <div className="flex text-red-400 font-medium flex-row self-center bg-red-50 px-4 py-2 text-sm rounded-md mb-3 border-2 border-red-400">
            <h4>Swap tokens can not be the same</h4>
          </div>
    )}
    <div className="flex items-center justify-center">
      <div className="w-100 p-8 shadow-md rounded-lg border-[0.5px]">
        <h1 className="font-medium text-center mb-6">SWAP</h1>

        <div className="w-full border-[0.5px] p-4 rounded-md mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-medium">{tokenFrom}</h1>

            <button
              onClick={() => open('from')}
              className="text-white text-xs bg-blue-500 rounded-full px-2 py-1"
            >
              Change
            </button>
          </div>

          <input
           type="number"
           placeholder="0.0"
           value={amountEntered}
           onChange={(e) => setAmountEntered(parseFloat(e.target.value))}
           onBlur={getPrice}
           className="bg-neutral-100 text-xl outline-none my-3 w-full rounded-md p-2"/>
        </div>

        <div className="w-full border-[0.5px] p-4 rounded-md mb-8">
          <div className="flex items-center justify-between mb-2">

              <>
                <h1 className="text-2xl font-medium">{tokenTo}</h1>

                <button
                  onClick={() => open('to')}
                  className="text-white text-xs bg-blue-500 rounded-full px-2 py-1"
                >
                  Change
                </button>
              </>

          </div>

          <input
                type="number"
                placeholder="0.0"
                disabled
                value={amountTo ? amountTo : 0.0}
                onChange={getPrice}
                className="bg-neutral-100 text-xl outline-none cursor-not-allowed my-3 w-full rounded-md p-2"
              />
           
          <button style={{background:'green', borderRadius:"5px"}} onClick={()=>getPrice()}>click to getPrice</button>

        </div>

        {tokenFrom !== tokenTo && (
          <>
            <h4 className="text-neutral-700 text-sm mb-2">Estimated gas fee: {gasPrice}</h4>
            {address && 
            <button className="w-full p-3 bg-blue-600 rounded-md text-white" onClick={()=>swap()}>
              Swap
            </button>
            }
          </>
        )}
      </div>
      <SelectTokenModal
        isOpen={isOpen}
        close={close}
        choice={choice}
        selectToken={selectToken}
      />
    </div>
    </>
  );
}

export default App;
