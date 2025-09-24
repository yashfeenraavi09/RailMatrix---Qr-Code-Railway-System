import Inventory from '../model/inventory.model.js'
import Dispatch from '../model/dispatch.model.js'
import Warranty from '../model/warranty.model.js'
import Part from '../model/from.model.js';

// export const getInventory = async (req, res) => {
//   try {
//     const items = await Inventory.find();
//     res.json(items);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// Allocated = 1
// export const getInventory = async (req, res) => {
//   try {
//     const items = await Item.find();
//     const inventoryMap = {};

//     items.forEach((item) => {
//       const type = item.item_type;

//       if (!inventoryMap[type]) {
//         inventoryMap[type] = {
//           _id: item._id,
//           item_name: type,
//           stock: 0,
//           allocated: 1,
//           reorder_level: 50,
//         };
//       }

//       inventoryMap[type].stock += 1;
//     });

//     const inventory = Object.values(inventoryMap).map((item) => {
//       const available = item.stock - item.allocated;
//       return { ...item, available: available < 0 ? 0 : available };
//     });

//     res.json(inventory);
//   } catch (err) {
//     console.error("Error fetching inventory:", err);
//     res.status(500).json({ error: "Failed to fetch inventory" });
//   }
// };

// allocated is randomly set between 0 and maxAllocated
// export const getInventory = async (req, res) => {
//   try {
//     const items = await Item.find();
//     const inventoryMap = {};

//     items.forEach((item) => {
//       const type = item.item_type;

//       if (!inventoryMap[type]) {
//         inventoryMap[type] = {
//           _id: item._id,
//           item_name: type,
//           stock: 0,
//           allocated: 0, // will assign randomly later
//           reorder_level: 50,
//         };
//       }

//       inventoryMap[type].stock += 1;
//     });

//     const inventory = Object.values(inventoryMap).map((item) => {
//       item.allocated = Math.floor(Math.random() * (item.stock + 1)); // random 0 to stock
//       const available = item.stock - item.allocated;
//       return { ...item, available: available < 0 ? 0 : available };
//     });

//     res.json(inventory);
//   } catch (err) {
//     console.error("Error fetching inventory:", err);
//     res.status(500).json({ error: "Failed to fetch inventory" });
//   }
// };

// Calculated maxAllocated as 80% of stock.
export const getInventory = async (req, res) => {
  try {
    const items = await Part.find();
    const inventoryMap = {};

    // Count stock per item type
    items.forEach((item) => {
      const type = item.item_type;

      if (!inventoryMap[type]) {
        inventoryMap[type] = {
          _id: item._id,
          item_name: type,
          stock: 0,
          allocated: 0, // temporarily 0, will set random later
          reorder_level: 50,
        };
      }

      inventoryMap[type].stock += 1;
    });

    // Set random allocated value ≤ 80% of stock
    const inventory = Object.values(inventoryMap).map((item) => {
      const maxAllocated = Math.floor(item.stock * 0.8);
      item.allocated = Math.floor(Math.random() * (maxAllocated + 1)); // 0 to maxAllocated inclusive
      const available = item.stock - item.allocated;
      return { ...item, available: available < 0 ? 0 : available };
    });

    res.json(inventory);
  } catch (err) {
    console.error("Error fetching inventory:", err);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
};

// export const getInventory = async (req, res) => {
//   try {
//     const items = await Item.find();
//     const inventoryMap = {};

//     // Step 1: Count stock for each item type
//     items.forEach((item) => {
//       const type = item.item_type;

//       if (!inventoryMap[type]) {
//         inventoryMap[type] = {
//           _id: item._id,
//           item_name: type,
//           stock: 0,
//           allocated: 0, // will be set later
//           reorder_level: 50,
//         };
//       }

//       inventoryMap[type].stock += 1;
//     });

//     // Step 2: Get existing inventory records from DB
//     const existingInventory = await Inventory.find();

//     // Step 3: Merge new stock with old allocated values
//     const inventory = Object.values(inventoryMap).map((item) => {
//       const existing = existingInventory.find(
//         (inv) => inv.item_name === item.item_name
//       );

//       let allocated = 0;
//       if (existing) {
//         // If record exists, keep its allocated value
//         allocated = existing.allocated;
//       } else {
//         // If new item, assign random allocated (max 80% of stock)
//         const maxAllocated = Math.floor(item.stock * 0.8);
//         allocated = Math.floor(Math.random() * (maxAllocated + 1));
//       }

//       const available = item.stock - allocated;

//       return {
//         ...item,
//         allocated,
//         available: available < 0 ? 0 : available,
//       };
//     });

//     // Step 4: Update Inventory DB with new values (upsert)
//     for (const inv of inventory) {
//       await Inventory.findOneAndUpdate(
//         { item_name: inv.item_name },
//         {
//           $set: {
//             stock: inv.stock,
//             allocated: inv.allocated,
//             available: inv.available,
//             reorder_level: inv.reorder_level,
//           },
//         },
//         { upsert: true, new: true }
//       );
//     }

//     res.json(inventory);
//   } catch (err) {
//     console.error("Error fetching inventory:", err);
//     res.status(500).json({ error: "Failed to fetch inventory" });
//   }
// };


export const getDispatchOrders = async (req, res) => {
  try {
    const orders = await Dispatch.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDispatch = async (req, res) => {
  try {
    const { dispatchId, status } = req.body;
    const updated = await Dispatch.findByIdAndUpdate(dispatchId, { status }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, order: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getWarrantyClaims = async (req, res) => {
  try {
    const claims = await Warranty.find();
    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const processWarranty = async (req, res) => {
  try {
    const { claimId, reportedBy } = req.body;
    const updated = await Warranty.findByIdAndUpdate(
      claimId,
      { status: "Approved", reportedBy },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, claim: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
