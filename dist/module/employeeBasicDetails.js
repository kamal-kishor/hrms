import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
const employeeBasicDetailsSchema = new Schema({
    _id: {
        type: String,
        default: () => {
            return generateEmployeeId();
        },
    },
    name: String,
    email: String,
    token: String,
    dateOfBirth: String,
    dateOfJoining: {
        type: Date,
        default: () => moment().toDate(),
    },
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true },
    },
    password: String,
    contactNumber: String,
    jobTitle: String,
    department: String,
    performanceRatings: Number,
    nationality: String,
    gender: String,
    religion: String,
    photo: {
        data: Buffer,
        contentType: String,
    },
    fatherName: String,
    emergencyNumber: String,
    relationWithEmergencyNumber: String,
    attendance: [
        {
            timeIn: {
                type: Date,
                default: () => moment().toDate(),
            },
            timeOut: {
                type: Date,
                default: () => moment().toDate(),
            },
            shift: String,
            shiftDuration: Number,
            shiftStartTime: String,
            shiftEndTime: String,
            present: Boolean,
        },
    ],
    leaves: [
        {
            leaveId: String,
            leaveApproval: String,
            shortLeave: String,
            reasonForLeave: String,
            totalLeaveBalance: Number,
            sickLeaveBalance: String,
            personalLeaveBalance: String,
            otherLeaveBalance: String,
            status: { type: String, enum: ["approved", "pending", "rejected"] }, // Status of the leave (e.g., approved, pending, rejected)
        },
    ],
    salary: [
        {
            date: Date,
            bankAccountNumber: String,
            ifscCode: String,
            basic: Number,
            housingAllowances: Number,
            travelAllowances: Number,
            bonus: Number,
            taxDeduction: Number,
            deduction: Number,
        },
    ],
    workStatus: { type: String, enum: ["in office", "remote"] },
    documents: [
        {
            highSchoolClgName: String,
            highSchoolboard: String,
            highSchoolpercentage: String,
            highSchoolCertificate: Buffer,
            intermediateClgName: String,
            intermediateboard: String,
            intermediatepercentage: String,
            intermediateCertificate: Buffer,
            bachelorsClgName: String,
            bachelorsboard: String,
            bachelorspercentage: String,
            bachelorsCertificate: Buffer,
            mastersClgName: String,
            mastersboard: String,
            masterspercentage: String,
            mastersCertificate: Buffer,
            certificationClgName: String,
            certificationboard: String,
            certificationpercentage: String,
            certificationCertificate: Buffer,
            passportNumber: String,
            dlNumber: String,
            aadharNumber: String,
        },
    ],
});
function generateEmployeeId() {
    const uuid = uuidv4();
    const timestampPart = uuid.slice(0, 8);
    return `TG${moment().format("YYMMDD")}${timestampPart}`;
}
export default model("EmployeeDetails", employeeBasicDetailsSchema);
