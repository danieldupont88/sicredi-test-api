import { IsEnum, isEnum, IsNotEmpty, IsString } from "class-validator";

export enum SimulationStatus {
    PENDING = 'PENDING',
    HIRED = 'HIRED'
}

export class Simulation {
    id?: string;
    ssn?: string;
    status: SimulationStatus;
    requestedAmount: number;
    totalAmount: number;
    installmentsNumber: number;
    monthlyInterest: number;

    validate() {
        if (!this.ssn) throw { error: 'status é obritório', status: 400 };
        if (!this.totalAmount) throw { error: 'totalAmount é obritório', status: 400 };
        if (!this.requestedAmount) throw { error: 'requestedAmount é obritório', status: 400 };
        if (!this.installmentsNumber) throw { error: 'installmentsNumber é obritório', status: 400 };
        if (!this.monthlyInterest) throw { error: 'monthlyInterest é obritório', status: 400 };
        if (Object.values(SimulationStatus).indexOf(this.status) < 0) throw { error: 'status é obritório com valores PENDING/HIRED', status: 400 };
    }
}