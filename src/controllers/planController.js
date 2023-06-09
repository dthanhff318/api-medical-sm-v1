const moment = require("moment");
const { HTTPStatusCode } = require("../constants");
const Store = require("../models/store.model");
const Plan = require("../models/plan.model");
const Noti = require("../models/noti.model");
const StoreDepart = require("../models/storeDepart.model");
const Department = require("../models/department.model");

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
        if (!findSupplyStore) {
          return {};
        }
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
      const { planList, typePlan, department } = await Plan.findById(id);
      const storeDepartment = await StoreDepart.findOne({
        department,
      });
      if (!storeDepartment) {
        return res
          .status(HTTPStatusCode.NOT_FOUND)
          .json("Can not found department");
      }
      // Type = 1, 2 : Import supply to department
      if (typePlan === 1) {
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
        await Plan.findByIdAndUpdate(
          id,
          {
            isAccepted: true,
          },
          { new: true }
        );
        const newNotiAccept = new Noti({
          notiFor: "user",
          department,
          status: "accept",
          createdTime: moment(new Date().now).format("DD-MM-YYYY"),
          ticket: id,
        });
        await newNotiAccept.save();
        return res.status(HTTPStatusCode.OK).json("Accepted");
      }
      if (typePlan === 2) {
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
        const newNotiAccept = new Noti({
          notiFor: "user",
          department,
          status: "accept",
          createdTime: moment(new Date().now).format("DD-MM-YYYY"),
          ticket: id,
        });
        await newNotiAccept.save();
        return res.status(HTTPStatusCode.OK).json(planAccepted);
      }
      if (typePlan === 3) {
        // Calculated quantity supply in Store
        for (const supply of planList) {
          const { id, quantity } = supply;
          const storeSupply = await Store.findById(id);
          const calculatedQuantity = storeSupply.quantity + quantity;
          await Store.findByIdAndUpdate(id, { quantity: calculatedQuantity });
        }
        // Update status of plan
        await Plan.findByIdAndUpdate(
          id,
          {
            isAccepted: true,
          },
          { new: true }
        );

        const newNotiAccept = new Noti({
          notiFor: "user",
          department,
          status: "accept",
          createdTime: moment(new Date().now).format("DD-MM-YYYY"),
          ticket: id,
        });
        await newNotiAccept.save();
        return res.status(HTTPStatusCode.OK).json("Accepted");
      }
      if (typePlan === 4) {
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
        const newNotiAccept = new Noti({
          notiFor: "user",
          department,
          status: "accept",
          createdTime: moment(new Date().now).format("DD-MM-YYYY"),
          ticket: id,
        });
        await newNotiAccept.save();
        return res.status(HTTPStatusCode.OK).json(planAccepted);
      }
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  // Ticket Department
  getTicketDepartment: async (req, res) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const calculatePage = (page - 1) * limit;
      // const queryObj = Object.entries(req.query).reduce((qrObj, q) => {
      //   if (q[1]) {
      //     return { ...qrObj, [q[0]]: q[1] };
      //   }
      // }, {});
      const getDepartment = await Department.findById(id);
      if (!getDepartment) {
        return res
          .status(HTTPStatusCode.NOT_FOUND)
          .json("Can't not found department");
      }
      const listPlans = await Plan.find({ department: id })
        .skip(calculatePage)
        .limit(Number(limit));
      const totalResults = await Plan.countDocuments({ department: id });
      const totalPages = Math.ceil(totalResults / limit);
      return res.status(HTTPStatusCode.OK).json({
        results: listPlans,
        pagination: {
          totalResults,
          totalPages,
          limit: Number(limit),
          page: Number(page),
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
};

module.exports = planController;
