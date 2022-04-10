## start
 It is best to use static service startup(最好使用静态服务服务启动)
    
    npm http-server -g 
    http-server -p 3000




# Some third-party packages 
## [web3modal](https://github.com/Web3Modal/web3modal)
```
    import Web3Modal, { connectors } from "web3modal"
    
    this.web3Modal = new Web3Modal({
      network:'mainnet' ,
      cacheProvider: true,
      providerOptions: {
          "custom-injected": {
            display: {
            logo: "https://cdn.bitkeep.vip/u_b_69b66a00-a046-11ec-a3eb-f758fa002ae8.png",
            name: "BitKeep",
            description: "Connect with the provider in your Browser",
            },
            package: connectors.injected,
            connector: async (ProviderPackage: any, options: any) => {
            const provider = new ProviderPackage(options)
            return provider
            }
      },
      }
    });
 ```   

   