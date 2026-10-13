import mongoose from "mongoose";
import Order from "../order.schema.js";
import User from "../user.schema.js";
import Jewelry from "../jewelry.schema.js";

/**
 * Genera un número de pedido único
 * Formato: ORD-TIMESTAMP-RANDOM
 */
function generateUniqueOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

/**
 * Busca una joya por nombre de diseño y verifica que pertenece al usuario
 */
async function findJewelryByDesignName(designName, userId) {
  const jewelry = await Jewelry.findOne({
    name: designName,
    user: userId
  });
  
  if (!jewelry) {
    return null;
  }
  
  return jewelry;
}

/**
 * Copia los datos de una joya (para agregar al carrito)
 */
function copyJewelryData(jewelry) {
  const copy = jewelry.toObject ? jewelry.toObject() : { ...jewelry };
  // Remover el _id para que MongoDB genere uno nuevo
  delete copy._id;
  return copy;
}

/**
 * Copia los datos de la dirección del usuario
 */
function copyAddressData(address) {
  if (!address) return null;
  const copy = address.toObject ? address.toObject() : { ...address };
  // Remover el _id para que MongoDB genere uno nuevo
  delete copy._id;
  return copy;
}

/**
 * Calcula el precio total de los productos
 */
function calculateTotalPrice(products) {
  let total = 0;
  for (const product of products) {
    const priceValue = product.currentPrice && product.currentPrice.toString 
      ? parseFloat(product.currentPrice.toString()) 
      : 0;
    total += priceValue;
  }
  return total;
}

async function populateOrderCollection(deps = {}) {
  try {

    // Cargar usuarios y joyas desde la BD (usar deps si vienen completos)
    let users = await User.find();
    let jewels = await Jewelry.find();

    // Si deps contiene referencias más útiles (ids), intentar cargar desde ahí
    if ((!users || users.length === 0) && deps.User && deps.User.length) {
      const uids = deps.User.map(u => u._id).filter(Boolean);
      users = await User.find({ _id: { $in: uids } });
    }
    if ((!jewels || jewels.length === 0) && deps.Jewelry && deps.Jewelry.length) {
      const jids = deps.Jewelry.map(j => j._id).filter(Boolean);
      jewels = await Jewelry.find({ _id: { $in: jids } });
    }

    if (!users || users.length === 0) {
      return { Order: [] };
    }
    if (!jewels || jewels.length === 0) {
      return { Order: [] };
    }

    const findUser = (name) => users.find(u => u.name === name);

    // Definir órdenes con formato: { user: "nombre", state: "estado", products: ["nombre_diseño_1", "nombre_diseño_2"] }
    const ordersDefinition = [
      {
        userName: "Juan",
        state: "inCart",
        designs: ["Solitario Diamante"], // Agregar aquí los nombres de los diseños que quieras
      },
      {
        userName: "Ana",
        state: "delivered",
        designs: ["Halo brillante"],
      },
      {
        userName: "Carlos",
        state: "ordered",
        designs: ["Mi creación"],
      }
    ];

    const created = [];

    for (const orderDef of ordersDefinition) {
      const user = findUser(orderDef.userName);
      if (!user) {
        continue;
      }

      // Copiar los diseños seleccionados
      const products = [];
      for (const designName of orderDef.designs) {
        const jewelry = await findJewelryByDesignName(designName, user._id);
        if (jewelry) {
          const jewelryCopy = copyJewelryData(jewelry);
          // Agregar campos opcionales del producto
          jewelryCopy.dedication = undefined; // Se puede especificar en la definición si se necesita
          products.push(jewelryCopy);
        }
      }

      if (products.length === 0) {
        continue;
      }

      // Calcular precios
      const totalPrice = calculateTotalPrice(products);
      const shippingPrice = 0;
      const taxableTotal = totalPrice / 1.21; // Restar IVA del 21%

      // Crear el pedido
      const order = new Order({
        orderNumber: generateUniqueOrderNumber(),
        user: user._id,
        state: orderDef.state,
        cartCreationDate: new Date(),
        lastUpdate: new Date(),
        ...(orderDef.state === "delivered" && { deliveryDate: new Date() }),
        taxableTotalPrice: mongoose.Types.Decimal128.fromString(taxableTotal.toFixed(2)),
        totalPrice: mongoose.Types.Decimal128.fromString(totalPrice.toFixed(2)),
        shippingPrice: mongoose.Types.Decimal128.fromString(shippingPrice.toString()),
        address: copyAddressData(user.address),
        products: products
      });

      await order.save();
      created.push({ _id: order._id, orderNumber: order.orderNumber });
    }

    return { Order: created };
  } catch (error) {
    console.error("Error al poblar Order:", error);
  }
}

export default populateOrderCollection;
