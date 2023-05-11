import React, { useState } from 'react';
import SelectTokenModal from '../components/selectModal';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [tokenFrom, setTokenFrom] = useState<string>('cUSD');
  const [tokenTo, setTokenTo] = useState<string | null>(null);
  const [choice, setChoice] = useState<string>('to');

  const open = (choiceType: string) => {
    setChoice(choiceType);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const selectToken = (token: string, choice: string) => {
    if (choice === 'from') {
      setTokenFrom(token);
    } else {
      setTokenTo(token);
    }
    setIsOpen(false);
  };

  return (
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
            className="bg-neutral-100 text-xl outline-none mb-2 w-full rounded-md p-2"
          />
        </div>

        <div className="w-full border-[0.5px] p-4 rounded-md mb-8">
          <div className="flex items-center justify-between mb-2">
            {!tokenTo ? (
              <button
                onClick={() => open('to')}
                className="text-lg bg-blue-500 text-white rounded-full px-4 py-2 font-medium"
              >
                Select a token
              </button>
            ) : (
              <>
                <h1 className="text-2xl font-medium">{tokenTo}</h1>

                <button
                  onClick={() => open('to')}
                  className="text-white text-xs bg-blue-500 rounded-full px-2 py-1"
                >
                  Change
                </button>
              </>
            )}
          </div>

          <input
            type="number"
            placeholder="0.0"
            className="bg-neutral-100 text-xl outline-none mb-2 w-full rounded-md p-2"
          />
        </div>

        {tokenFrom !== tokenTo && (
          <>
            <h4 className="text-neutral-700 text-sm mb-2">Estimated gas fee:</h4>
            <button className="w-full p-3 bg-blue-600 rounded-md text-white">
              Swap
            </button>
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
  );
}

export default App;
