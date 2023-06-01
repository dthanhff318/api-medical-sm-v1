const { HTTPStatusCode } = require("../constants");
const Store = require("../models/store.model");
const Plan = require("../models/plan.model");
const Noti = require("../models/noti.model");
const StoreDepart = require("../models/storeDepart.model");

const planController = {
  sendPlan: async (req, res) => {
    try {
      const data = req.body;
      const newPlan = new Plan(data);
      const planRes = await newPlan.save();
      const newNotiSent = new Noti({
        notiFor: "admin",
        department: data.department,
        status: "sent",
        createdTime: data.createdTime,
        ticket: planRes.id,
      });
      await newNotiSent.save();
      return res.status(HTTPStatusCode.OK).json(planRes);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  getPlans: async (req, res) => {
    try {
      const queryObj = Object.entries(req.query).reduce((qrObj, q) => {
        if (q[1]) {
          return { ...qrObj, [q[0]]: q[1] };
        }
      }, {});
      const listPlans = await Plan.find(queryObj);
      return res.status(HTTPStatusCode.OK).json(listPlans);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  getPlanDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const existPlan = await Plan.findById(id);
      if (!existPlan) {
        return res
          .status(HTTPStatusCode.NOT_FOUND)
          .json("Can not found ticket");
      }
      const findPlan = await Plan.findById(id).populate({
        path: "department",
        model: "Department",
        select: "name",
      });
      const listSupply = await Store.find({}).populate({
        path: "company",
        model: "Supplier",
        select: "name",
      });
      const detailListSupply = findPlan.planList.map((e) => {
        const findSupplyStore = listSupply.find((d) => d._id === e.id);
        const { _id, yearBidding, __v, codeBidding, ...rest } =
          findSupplyStore._doc;
        return { ...rest, id: e.id, quantityExpect: e.quantity };
      });
      findPlan.planList = detailListSupply;
      return res.status(HTTPStatusCode.OK).json(findPlan);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  deletePlan: async (req, res) => {
    try {
      const { id } = req.params;
      await Plan.findByIdAndDelete(id);
      return res.status(HTTPStatusCode.OK).json();
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  acceptPlan: async (req, res) => {
    try {
      const { id } = req.params;
      const { planList, type, department } = await Plan.findById(id);
      if (type === 2) {
        // Calculated quantity supply in Store
        for (const supply of planList) {
          const { id, quantity } = supply;
          const storeSupply = await Store.findById(id);
          const calculatedQuantity = storeSupply.quantity - quantity;
          if (calculatedQuantity < 0 || quantity < 0) {
            return res
              .status(HTTPStatusCode.BAD_REQUEST)
              .json("Count of supply in store is less than expected");
          }
          await Store.findByIdAndUpdate(id, { quantity: calculatedQuantity });
        }
        // Update status of plan
        const planAccepted = await Plan.findByIdAndUpdate(
          id,
          {
            isAccepted: true,
          },
          { new: true }
        );
        // Calculated quantity supply in Store Department
        const storeDepartment = await StoreDepart.findOne({
          department: planAccepted.department,
        });
        // Update supple in store department
        let storeDepartmentData = [...storeDepartment.data];
        planList.forEach((e) => {
          const supplyAvailable = storeDepartmentData.find(
            (i) => i.supply === e.id
          );
          if (supplyAvailable) {
            storeDepartmentData = storeDepartmentData.map((x) =>
              x.supply === e.id
                ? {
                    ...x,
                    quantity: Number(x.quantity) + Number(e.quantity),
                  }
                : x
            );
          } else {
            storeDepartmentData.push({
              supply: e.id,
              quantity: e.quantity,
            });
          }
        });
        await StoreDepart.findOneAndUpdate(
          { department: planAccepted.department },
          { data: storeDepartmentData }
        );
        return res.status(HTTPStatusCode.OK).json(planAccepted);
      }
      if (type === 4) {
        // Calculated quantity supply in Store Department
        const storeDepartment = await StoreDepart.findOne({
          department,
        });

        // Update supply in store department
        let storeDepartmentData = [...storeDepartment.data];
        planList.forEach((e) => {
          storeDepartmentData = storeDepartmentData.map((x) => {
            if (x.supply === e.id) {
              return {
                ...x,
                quantity: Number(x.quantity) - Number(e.quantity),
              };
            }
            return x;
          });
        });
        const checkValid = storeDepartmentData.every((e) => e.quantity >= 0);
        if (!checkValid) {
          return res
            .status(HTTPStatusCode.BAD_REQUEST)
            .json(
              "Count of supply want to refund bigger than quantity in store"
            );
        }
        // Calculated quantity supply in Store
        for (const supply of planList) {
          const { id, quantity } = supply;
          const storeSupply = await Store.findById(id);
          const calculatedQuantity = storeSupply.quantity + quantity;
          await Store.findByIdAndUpdate(id, { quantity: calculatedQuantity });
        }
        // Update status of plan
        const planAccepted = await Plan.findByIdAndUpdate(
          id,
          {
            isAccepted: true,
          },
          { new: true }
        );

        await StoreDepart.findOneAndUpdate(
          { department: planAccepted.department },
          { data: storeDepartmentData }
        );
        return res.status(HTTPStatusCode.OK).json(planAccepted);
      }
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  // refundPlan: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const { typePlan, planList, department } = await Plan.findById(id);

  //     // Calculated quantity supply in Store Department
  //     const storeDepartment = await StoreDepart.findOne({
  //       department,
  //     });

  //     // Update supply in store department
  //     let storeDepartmentData = [...storeDepartment.data];
  //     planList.forEach((e) => {
  //       storeDepartmentData = storeDepartmentData.map((x) => {
  //         if (x.supply === e.id) {
  //           return {
  //             ...x,
  //             quantity: Number(x.quantity) - Number(e.quantity),
  //           };
  //         }
  //         return x;
  //       });
  //     });
  //     const checkValid = storeDepartmentData.every((e) => e.quantity >= 0);
  //     if (!checkValid) {
  //       return res
  //         .status(HTTPStatusCode.BAD_REQUEST)
  //         .json("Count of supply want to refund bigger than quantity in store");
  //     }
  //     // Calculated quantity supply in Store
  //     for (const supply of planList) {
  //       const { id, quantity } = supply;
  //       const storeSupply = await Store.findById(id);
  //       const calculatedQuantity = storeSupply.quantity + quantity;
  //       await Store.findByIdAndUpdate(id, { quantity: calculatedQuantity });
  //     }
  //     // Update status of plan
  //     const planAccepted = await Plan.findByIdAndUpdate(
  //       id,
  //       {
  //         isAccepted: true,
  //       },
  //       { new: true }
  //     );

  //     await StoreDepart.findOneAndUpdate(
  //       { department: planAccepted.department },
  //       { data: storeDepartmentData }
  //     );
  //     return res.status(HTTPStatusCode.OK).json(planAccepted);
  //   } catch (err) {
  //     console.log(err);
  //     return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
  //   }
  // },
};

module.exports = planController;
