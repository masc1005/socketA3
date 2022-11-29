const momente = require("moment");

const { sales, sellers, stores } = require("../infos/sales");
const getData = require("../helper/getData");

async function menu(socket) {
  socket.write("1 - Nova venda \n");
  socket.write("2 - Melhor vendedor \n");
  socket.write("3 - Melhor loja \n");
  socket.write("4 - Buscar vendedor por nome \n");
  socket.write("5 - Buscar loja por código \n");
  socket.write("6 - Buscar vendas por período \n");
  socket.write("10 - Sair \n");

  const option = await getData(socket);

  switch (option) {
    case "1":
      newSale(socket);
      break;
    case "2":
      betterSeller(socket);
      break;
    case "3":
      bestStore(socket);
      break;
    case "4":
      findSellerByName(socket);
      break;
    case "5":
      findStoreByCode(socket);
      break;
    case "6":
      findSaleByPeriod(socket);
      break;
    case "10":
      socket.end();
      break;
    default:
      socket.write("Opção inválida \n");
      menu(socket);
  }
}

async function newSale(socket) {
  let sale = {};
  socket.write("Informe o id do vendedor: \n");

  const sellerId = await getData(socket);
  let seller = sellers.find((seller) => seller.id == parseInt(sellerId));

  if (seller) {
    socket.write(`Vendedor: ${seller.name} \n`);

    socket.write("Informe o código da loja: \n");
    sale.storeCode = parseInt(await getData(socket));

    socket.write("Informe o valor da venda: \n");
    sale.total = parseFloat(await getData(socket));

    socket.write("Informe a data da venda: \n");
    sale.date = new Date(await getData(socket));
  }

  sale.id = sales.length + 1;

  sale.sellersName = seller.name;

  sales.push(sale);

  socket.write("Venda cadastrada com sucesso! \n");

  menu(socket);
}

async function betterSeller(socket) {
  let total;

  socket.write("melhor vendedor \n");

  let bestSeller = { name: "", total: 0 };

  sellers.map((seller) => {
    total = sales
      .filter((sale) => sale.sellersName == seller.name)
      .reduce((acc, cur) => acc + cur.total, 0);

    if (total > bestSeller.total) {
      bestSeller = { name: seller.name, total };
    }
  });

  socket.write(
    `Melhor vendedor: ${bestSeller.name} | Total: ${bestSeller.total} \n`
  );

  // socket.clear();
  menu(socket);
}

async function bestStore(socket) {
  socket.write("melhor loja \n");

  let bestStore = { name: "", total: 0 };

  stores.map((store) => {
    const total = sales
      .filter((sale) => sale.storeCode == store.id)
      .reduce((acc, cur) => acc + cur.total, 0);

    if (total > bestStore.total) {
      bestStore = { name: store.name, total };
    }
  });

  socket.write(`Melhor loja: ${bestStore.name} \n`);

  menu(socket);
}

async function findSellerByName(socket) {
  socket.write("Informe o nome do vendedor: \n");
  const sellerName = await getData(socket);

  const seller = sellers.find((seller) => seller.name == sellerName);

  const total = sales
    .filter((sale) => sale.sellersName == seller.name)
    .reduce((acc, cur) => acc + cur.total, 0);

  if (seller) {
    socket.write(`Vendedor: ${seller.name} | Total: ${total} \n`);
  } else {
    socket.write("Vendedor não encontrado \n");
  }

  menu(socket);
}

async function findStoreByCode(socket) {
  socket.write("Informe o código da loja: \n");
  const storeCode = await getData(socket);

  const store = stores.find((store) => store.id == storeCode);

  const total = sales
    .filter((sale) => sale.storeCode == store.id)
    .reduce((acc, cur) => acc + cur.total, 0);

  if (store) {
    socket.write(`Loja: ${store.name} | Total: ${total} \n`);
  } else {
    socket.write("Loja não encontrada \n");
  }

  menu(socket);
}

async function findSaleByPeriod(socket) {
  socket.write("Informe a data inicial: \n");
  const initialDate = new Date(await getData(socket));

  socket.write("Informe a data final: \n");
  const finalDate = new Date(await getData(socket));

  const salesByPeriod = sales.filter((sale) => {
    let saleDate = momente(sale.date).isBetween(
      momente(initialDate),
      momente(finalDate)
    );

    return saleDate;
  });

  if (salesByPeriod.length > 0) {
    salesByPeriod.map((sale) => {
      socket.write(
        `Vendedor: ${sale.sellersName} | Loja: ${sale.storeCode} | Valor: ${sale.total} | Data: ${sale.date} \n`
      );
    });

    menu(socket);
  } else {
    socket.write("Nenhuma venda encontrada \n");
  }
}

module.exports = {
  newSale,
  betterSeller,
  bestStore,
  findSellerByName,
  findStoreByCode,
  findSaleByPeriod,
  menu,
};
