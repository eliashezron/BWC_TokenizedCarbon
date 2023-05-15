import { parseEther } from "ethers/lib/utils.js";
import { useState } from "react";
import ToucanClient from "toucan-sdk";
import { useProvider, useSigner } from "wagmi";
// import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router';
import Head from 'next/head'

export default function Home() {
  const router = useRouter();

  const [tco2Address, setTco2Address] = useState("");
  const provider = useProvider();
  const { data: signer, isError, isLoading } = useSigner();
  const toucan = new ToucanClient("alfajores", provider);
  signer && toucan.setSigner(signer);

  const redeemPoolToken = async (): Promise<void> => {
    const redeemedTokenAddress = await toucan.redeemAuto2(
      "NCT",
      parseEther("1")
    );
    redeemedTokenAddress && setTco2Address(redeemedTokenAddress[0].address);
  }

  const retireTco2Token = async (): Promise<void> => {
    tco2Address.length && (await toucan.retire(parseEther("1"), tco2Address));
  }
  const swap = () => {
    router.push('/swap');  // Assuming 'swap' is the path to your swap page
  }
  return (
    <div className="container">
      <Head>
        <title>Climate Application</title>
        <meta name="description" content="An application to help fight climate change" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1 className="title">
          Welcome to Climate Initiative
        </h1>

        <p className="description">
          Offset your carbon footprint with <code className="code">tCO2</code> tokens
        </p>

        <div className="buttons">
          <button className="button" onClick={() => redeemPoolToken()}>Redeem</button>
          <button className="button" onClick={() => retireTco2Token()}>Retire</button>
          <button className="button" onClick={() => swap()}>Swap</button>
        </div>
      </main>

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 0 0.5rem;
         
        }

        .main {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          padding: 5rem 0;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .description {
          text-align: center;
          line-height: 1.5;
          font-size: 1.5rem;
        }

        .buttons {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-top: 2rem;
        }

        .buttons button {
          background-color: #ffffff;
          color: #50C878;
          border: none;
          padding: 1rem 2rem;
          margin: 1rem;
          cursor: pointer;
          border-radius: 5px;
          font-size: 1rem;
        }

        @media (min-width: 600px) {
          .buttons {
            flex-direction: row;
          }

          .title {
            font-size: 5rem;
          }

          .description {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>

    
  )
}

