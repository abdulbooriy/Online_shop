import database from "../config/database.js";
import orderValidation from "../validations/order.validation.js";

async function findAll(req, res) {
  try {
    let [data] = await database.query("select * from orders");
    if (data.length == 0) {
      return res.status(403).send({ message: "Table 'orders' are empty😞" });
    }
    res.status(200).send({ data });
  } catch (error) {
    res.status(500).send({ error_message: error.message });
  }
}

async function findOne(req, res) {
  try {
    let { id } = req.params;
    let [data] = await database.query("select * from orders where id = ?", [
      id,
    ]);
    if (data.length == 0) {
      return res.status(403).send({ message: "Order not found❗" });
    }
    res.status(403).send({ data });
  } catch (error) {
    res.status(500).send({ error_message: error.message });
  }
}

async function create(req, res) {
  try {
    let { value, error } = orderValidation(req.body);
    if (error) {
      return res.status(403).send({ message: error.details[0].message });
    }
    let { user_id, totalPrice, products } = value;
    let [u] = await database.query("select * from users where id = ?", [
      user_id,
    ]);
    if (u.length == 0) {
      return res
        .status(403)
        .send({ message: "Siz kiritgan user_id tableda mavjud emas❗" });
    }

    let [orderData] = await database.query(
      "insert into orders (user_id, totalPrice) values (?, ?)",
      [user_id, totalPrice]
    );
    let newID = orderData.insertId;

    let createdOrderItems = [];
    for (let orderItem of products) {
      let [orderItems] = await database.query(
        "insert into orderItem (product_id, order_id, quantity, totalSumma) values (?, ?, ?, ?)",
        [orderItem.product_id, newID, orderItem.quantity, orderItem.totalSumma]
      );

      let [newOrderItem] = await database.query(
        "select * from orderItem where id = ?",
        [orderItems.insertId]
      );

      createdOrderItems.push(newOrderItem[0]);
    }
    res.status(200).send(
    {message: "Order and OrderItem created",
        order: {
          order_id: newID,
          user_id: user_id,
          totalPrice: totalPrice,
          orderItems: createdOrderItems,
        },
      });
  } catch (error) {
    res.status(500).send({ error_message: error.message });
  }
}

async function update(req, res) {
  try {
    let { value, error } = orderValidation(req.body);
    if (error) {
      return res.status(403).send({ message: error.details[0].message });
    }
    let { user_id } = value;
    let [u] = await database.query("select * from users where id = ?", [
      user_id,
    ]);
    if (u.length == 0) {
      return res
        .status(403)
        .send({ message: "Siz kiritgan user_id tableda mavjud emas" });
    }
    let { id } = req.params;
    let [oldData] = await database.query("select * from orders where id = ? ", [
      id,
    ]);
    if (oldData.length == 0) {
      return res.status(403).send({ message: "user_id not found❗" });
    }
    let [data] = await database.query(
      "update orders set user_id = ?  where id = ?",
      [user_id, id]
    );
    let check = data.affectedRows;
    if (check > 0) {
      let [updatedData] = await database.query(
        "select * from orders where id = ? ",
        [id]
      );
      res.status(200).send({ "user_id updated successfully": updatedData });
    }
  } catch (error) {
    res.status(500).send({ error_message: error.message });
  }
}

async function remove(req, res) {
  try {
    let { id } = req.params;
    let [oldData] = await database.query("select * from orders where id = ?", [
      id,
    ]);
    if (oldData.length == 0) {
      return res.status(403).send({ message: "user_id not found" });
    }
    let [data] = await database.query("delete from orders where id = ?", [id]);
    let check = data.affectedRows;
    if (check > 0) {
      res.status(200).send({ "Deleted order": oldData });
    }
  } catch (error) {
    res.status(500).send({ error_message: error.message });
  }
}

export { findAll, findOne, create, update, remove };