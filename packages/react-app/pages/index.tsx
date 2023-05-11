import { parseEther } from "ethers/lib/utils.js";
import { useState } from "react";
import ToucanClient from "toucan-sdk";
import { useProvider, useSigner } from "wagmi";

export default function Home() {

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
  return (
    <div>
      <button
      className="inline-flex w-full justify-center rounded-full border px-5 my-5 py-2 text-md font-medium border-wood bg-prosperity text-black hover:bg-snow"
      onClick={() => redeemPoolToken()}>
        Test redeem
      </button>
      <button
      className="inline-flex w-full justify-center rounded-full border px-5 my-5 py-2 text-md font-medium border-wood bg-prosperity text-black hover:bg-snow"
      onClick={() => retireTco2Token()}>
        Test retire
      </button>
    </div>
  )
}