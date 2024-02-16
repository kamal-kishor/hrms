import mongoose from "mongoose";
import EmployeeDetails from "../../module/employeeBasicDetails.js";
import { check_auth } from "../../util/check_auth.js";
import {
  validateRegisterInput,
  validateLoginInput,
} from "../../util/validator.js";
import { UserInputError } from "apollo-server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );
}

export const resolvers = {
  Query: {
    default: () => {
      return "Server is running smoothly!";
    },

    async getEmpDetails() {
      try {
        const empDetail = await EmployeeDetails.find().sort({ timeStemp: -1 });
        return empDetail;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async registerEmployee(parent, args) {
      try {
        const {
          name,
          email,
          password,
          contactNumber,
          jobTitle,
          department,
          dateOfJoining,
        } = args.input;
        const { valid, errors } = validateRegisterInput(
          name,
          email,
          password,
          contactNumber,
          jobTitle,
          department,
          dateOfJoining
        );
        if (!valid) {
          console.log("Validation Errors: ", errors);
          throw new UserInputError("Validation-Error", { errors });
        }

        const emp = await EmployeeDetails.findOne({ email });
        if (emp) {
          throw new UserInputError("Employee with this email Already Exist", {
            errors: {
              email: "Warning: This Email is Already Taken by other Employee",
            },
          });
        }

        if (!/^\d+$/.test(contactNumber)) {
          throw new UserInputError("Invalid Contact Number", {
            errors: {
              contactNumber: "Contact Number should only contain numbers.",
            },
          });
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!dateRegex.test(dateOfJoining)) {
          throw new UserInputError("Invalid Date Format", {
            errors: {
              dateOfJoining: "Date should be in the format YYYY-MM-DD.",
            },
          });
        }
        const hashPassword = await bcrypt.hash(password, 12);

        const uuid = uuidv4();
        const timestampPart = uuid.slice(0, 8);
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}${(
          currentDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}${currentDate
          .getDate()
          .toString()
          .padStart(2, "0")}`;

        const newEmp = new EmployeeDetails({
          _id: `TG${formattedDate}${timestampPart}`,
          name,
          email,
          password: hashPassword,
          contactNumber,
          jobTitle,
          department,
          dateOfJoining,
        });

        const res = await newEmp.save();
        const token = generateToken(res);

        return { ...res._doc, id: res._id, token };
      } catch (error) {
        console.log("Error on Registering New Employee: ", error);
        throw new Error(error);
      }
    },

    async loginEmployee(parent, args) {
      try {
        const { email, password } = args.input;
        const { valid, errors } = validateLoginInput(email, password);

        if (!valid) {
          throw new UserInputError("Login-Validation-Error: ", { errors });
        }

        const user = await EmployeeDetails.findOne({ email });
        if (!user) {
          errors.general = "User not Found";
          throw new UserInputError("Wron-Credentials: ", errors);
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          errors.general = "Wrong Credentials";
          throw new UserInputError("Wrong Credentials: ", errors);
        }

        const token = generateToken(user);
        return { ...user._doc, id: user._id, token };
      } catch (error) {
        console.log("Error on Employee Login: ", error);
        throw new Error(error);
      }
    },

    async updateEmpDetails(parent, args, context) {
      try {
        const emp = check_auth(context);
        const {
          gender,
          religion,
          nationality,
          dateOfBirth,
          fatherName,
          emergencyNumber,
          relationWithEmergencyNumber,
        } = args.input;

        const { valid, errors } = validateLoginInput(email, password);

        // const updateDetails = new
      } catch (error) {
        console.log("Error on Employee Data Updation: ", error);
        throw new Error(error);
      }
    },
  },
};
