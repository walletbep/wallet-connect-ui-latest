
// WalletConnect v2 Controller Client
import("https://cdn.jsdelivr.net/npm/@walletconnect/sign-client/dist/umd/index.min.js").then(async (pkg) => {

  const SignClient = pkg.default;

  const client = await SignClient.init({
    projectId: "a50f4d7d1e8bd4111c564ffd0e123456", // demo project id (replace in production)
    relayUrl: "wss://relay.walletconnect.com",
    metadata: {
      name: "My Dapp",
      description: "WC v2 Multichain Demo",
      url: "https://example.com",
      icons: ["https://walletconnect.com/walletconnect-logo.png"]
    }
  });

  document.getElementById("connectBtn").onclick = async () => {

    const { uri, approval } = await client.connect({
      requiredNamespaces: {
        eip155: {
          methods: ["eth_sendTransaction", "personal_sign", "eth_signTypedData"],
          chains: ["eip155:1", "eip155:56", "eip155:137"], // Ethereum, BNB, Polygon
          events: ["chainChanged", "accountsChanged"]
        }
      },
    });

    if (uri) {
      // Open QR modal
      window.open(`https://explorer.walletconnect.com/?type=wc&uri=${encodeURIComponent(uri)}`, "_blank");
    }

    const session = await approval();

    const address = session.namespaces.eip155.accounts[0].split(":")[2];
    const chain = session.namespaces.eip155.accounts[0].split(":")[1];

    document.getElementById("addr").innerText = address;
    document.getElementById("chain").innerText = chain;
    document.getElementById("walletInfo").style.display = "block";
  };
});
