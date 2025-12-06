
// Full WalletConnect v2 + Multichain + Dashboard + Token + Price + UI

import("https://cdn.jsdelivr.net/npm/@walletconnect/sign-client/dist/umd/index.min.js")
.then(async (pkg) => {

  const SignClient = pkg.default;

  const client = await SignClient.init({
    projectId: "a50f4d7d1e8bd4111c564ffd0e123456",
    relayUrl: "wss://relay.walletconnect.com",
    metadata: {
      name: "Full dApp",
      description: "Premium WCv2 Multichain dApp",
      url: "https://example.com",
      icons: ["https://walletconnect.com/walletconnect-logo.png"]
    }
  });

  const rpcMap = {
    "1": "https://rpc.ankr.com/eth",
    "56": "https://bsc-dataseed.binance.org/",
    "137": "https://polygon-rpc.com/"
  };

  document.getElementById("connectBtn").onclick = async () => {

    const { uri, approval } = await client.connect({
      requiredNamespaces: {
        eip155: {
          methods: ["eth_sendTransaction", "personal_sign"],
          chains: ["eip155:1", "eip155:56", "eip155:137"],
          events: ["chainChanged", "accountsChanged"]
        }
      }
    });

    if (uri) {
      window.open(
        `https://explorer.walletconnect.com/?type=wc&uri=${encodeURIComponent(uri)}`,
        "_blank"
      );
    }

    const session = await approval();

    const acc = session.namespaces.eip155.accounts[0];
    const split = acc.split(":");

    const chainId = split[1];
    const address = split[2];

    document.getElementById("dashboard").style.display = "block";
    document.getElementById("swap").style.display = "block";

    document.getElementById("addr").innerText = address;
    document.getElementById("chain").innerText = chainId;

    // Native balance
    const provider = new ethers.JsonRpcProvider(rpcMap[chainId]);
    const balWei = await provider.getBalance(address);
    const bal = ethers.formatEther(balWei);

    document.getElementById("bal").innerText = bal;

    // Token Balance
    document.getElementById("fetchTokenBtn").onclick = async () => {
      const tokenAddr = document.getElementById("tokenAddress").value;

      const abi = [
        "function balanceOf(address) view returns (uint256)",
        "function decimals() view returns (uint8)"
      ];

      const token = new ethers.Contract(tokenAddr, abi, provider);
      const raw = await token.balanceOf(address);
      const decimals = await token.decimals();
      const amount = Number(raw) / 10**decimals;

      document.getElementById("tokenBal").innerText = amount;
    };

    // Token price via CoinGecko
    document.getElementById("fetchPriceBtn").onclick = async () => {
      const id = document.getElementById("tokenId").value.trim();

      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`;

      const res = await fetch(url);
      const json = await res.json();

      document.getElementById("tokenPrice").innerText =
        json[id] ? json[id].usd + " USD" : "Invalid ID";
    };

  };
});
