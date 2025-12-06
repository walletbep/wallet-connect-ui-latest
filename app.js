
// WalletConnect v2 Global Client from CDN UMD
const SignClient = window.WalletConnectSignClient;

async function init() {

  const client = await SignClient.init({
    projectId: "a50f4d7d1e8bd4111c564ffd0e123456",
    relayUrl: "wss://relay.walletconnect.com",
    metadata: {
      name: "Full dApp",
      description: "WalletConnect v2 Multichain dApp",
      url: "https://example.com",
      icons: ["https://walletconnect.com/walletconnect-logo.png"]
    }
  });

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
    const [ , chainId, address ] = acc.split(":");

    document.getElementById("dashboard").style.display = "block";
    document.getElementById("addr").innerText = address;
    document.getElementById("chain").innerText = chainId;

    const rpcMap = {
      "1": "https://rpc.ankr.com/eth",
      "56": "https://bsc-dataseed.binance.org/",
      "137": "https://polygon-rpc.com/"
    };

    const provider = new ethers.JsonRpcProvider(rpcMap[chainId]);
    const balWei = await provider.getBalance(address);
    const bal = ethers.formatEther(balWei);
    document.getElementById("bal").innerText = bal;
  };
}

init();
