module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  // truffle-config 和 truffle 配置同时存在 读取前者
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545, // 部署 truffle migrate 的时候连接的ip
      network_id: "*" // Match any network id
    }
  }
};
