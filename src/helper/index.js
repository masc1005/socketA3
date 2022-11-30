const momente = require("moment");
const path = require("node:path");

const getData = path.resolve(__dirname, "../helper/getData");

const { sales, sellers, stores } = require("../infos/sales");
const get = require(getData);

async function menu(socket) {
  socket.write("\n \r1 - Nova venda \n \r");
  socket.write("2 - Melhor vendedor \n \r");
  socket.write("3 - Melhor loja \n \r");
  socket.write("4 - Buscar vendedor por nome \n \r");
  socket.write("5 - Buscar loja por código \n \r");
  socket.write("6 - Buscar vendas por período \n \r");
  socket.write("7 - Buscar vendedor por código \n \r");
  socket.write("10 - Sair \n \r \n \r");

  const option = await get(socket);

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
    case "7":
      findSellerById(socket);
      break;
    case "10":
      socket.end();
      break;
    default:
      socket.write("Opção inválida \n \r");
      menu(socket);
  }
}

async function newSale(socket) {
  let sale = {};
  socket.write(
    " - Opção Selecionada: Nova Venda \n \r\n \rInforme o id do vendedor: "
  );

  const sellerId = await get(socket);
  let seller = sellers.find((seller) => seller.id == parseInt(sellerId));

  if (seller) {
    socket.write(`\n \rVendedor: ${seller.name} \n \r`);

    socket.write("Informe o código da loja: ");
    sale.storeCode = parseInt(await get(socket));

    socket.write("\n \rInforme o valor da venda: ");
    sale.total = parseFloat(await get(socket));

    socket.write("\n \rInforme a data da venda: ");
    sale.date = new Date(await get(socket));
  }

  sale.id = sales.length + 1;

  sale.sellersName = seller.name;

  sales.push(sale);

  socket.write("\n \rVenda cadastrada com sucesso! \n \r");

  menu(socket);
}

async function betterSeller(socket) {
  let total;

  socket.write(" - Opção Selecionada: Melhor vendedor \n \r");

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
    `\n\r Melhor vendedor: ${bestSeller.name} | Total: ${bestSeller.total} \n \r`
  );
  menu(socket);
}

async function bestStore(socket) {
  socket.write(" - Opção Selecionada: Melhor loja \n \r");

  let bestStore = { name: "", total: 0 };

  stores.map((store) => {
    const total = sales
      .filter((sale) => sale.storeCode == store.id)
      .reduce((acc, cur) => acc + cur.total, 0);

    if (total > bestStore.total) {
      bestStore = { name: store.name, total };
    }
  });

  socket.write(`\n \rMelhor loja: ${bestStore.name} \n \r`);

  menu(socket);
}

async function findSellerByName(socket) {
  socket.write(" - Informe o nome do vendedor: ");
  const sellerName = await get(socket);

  const seller = sellers.find((seller) => seller.name == sellerName);

  if (seller) {
    const total = sales
      .filter((sale) => sale.sellersName == seller.name)
      .reduce((acc, cur) => acc + cur.total, 0);

    socket.write(`\n \r \n \rVendedor: ${seller.name} | Total: ${total} \n \r`);
  } else {
    socket.write("Vendedor não encontrado \n \r");
  }

  menu(socket);
}

async function findSellerById(socket) {
  socket.write(" - Informe o id do vendedor: ");
  const sellerId = await get(socket);

  const seller = sellers.find((seller) => seller.id == sellerId);

  if (seller) {
    const total = sales
      .filter((sale) => sale.sellersName == seller.name)
      .reduce((acc, cur) => acc + cur.total, 0);
    socket.write(`\n \r \n \rVendedor: ${seller.name} | Total: ${total} \n \r`);
  } else {
    socket.write("Vendedor não encontrado \n \r");
  }

  menu(socket);
}

async function findStoreByCode(socket) {
  socket.write(" - Informe o código da loja: ");
  const storeCode = await get(socket);

  const store = stores.find((store) => store.id == storeCode);

  if (store) {
    const total = sales
      .filter((sale) => sale.storeCode == store.id)
      .reduce((acc, cur) => acc + cur.total, 0);
    socket.write(`\n \r \n \rLoja: ${store.name} | Total: ${total} \n \r`);
  } else {
    socket.write("Loja não encontrada \n \r");
  }

  menu(socket);
}

async function findSaleByPeriod(socket) {
  socket.write("Informe a data inicial: \n \r");
  const initialDate = new Date(await get(socket));

  socket.write("Informe a data final: \n \r");
  const finalDate = new Date(await get(socket));

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
        `Vendedor: ${sale.sellersName} | Loja: ${sale.storeCode} | Valor: ${sale.total} | Data: ${sale.date} \n \r`
      );
    });

    menu(socket);
  } else {
    socket.write("Nenhuma venda encontrada \n \r");
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
