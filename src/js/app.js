App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {

    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider("http://127.0.0.1:9545");
    }
    window.web3 = new Web3(App.web3Provider);
    // console.log('## web3 ', web3)
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.json', function(data) {
      var AdoptionArtifact = data;

      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
      console.log('## App.web3Provider', App.web3Provider, '123', App.contracts.Adoption.setProvider)
      App.contracts.Adoption.setProvider(App.web3Provider);

      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    
    var apotionInstance;
    // console.log('## App.contracts.Adoption ==>', App.contracts.Adoption)
    App.contracts.Adoption.deployed().then(function(instance) {
      // console.log('## instance ==>', instance)
      apotionInstance = instance;
      return apotionInstance.getAdopters();
    }).then(function(adopters) {
      console.log('## adopters ==>', adopters)
      for(i =0; i< adopters.length; i++) {
        console.log(adopters[i], typeof adopters[i],  adopters[i] !== '0x');
        if(adopters[i] !== '0x0000000000000000000000000000000000000000' && adopters[i] !== '0x') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    })
  },

  handleAdopt: async function(event) {
    event.preventDefault();
    var apotionInstance;
    var petId = parseInt($(event.target).data('id'));
    console.log('## id ==>', petId)
    console.log('## web3', web3)
    // const ret = await web3.eth.getAccounts()
    // console.log('##ret =>', ret)
    web3.eth.getAccounts(function(error, accounts){
      var account = accounts[0];
      console.log('## account ==> ', error, account)
      App.contracts.Adoption.deployed().then(function(instance){
        apotionInstance = instance;

        return apotionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        console.log('## result', result)
        return App.markAdopted();
      } ).catch(function(err) {
        console.log(err.message);
      });
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
