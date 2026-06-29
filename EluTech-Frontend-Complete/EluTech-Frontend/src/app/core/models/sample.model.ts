export interface Sample {

    id:number;

    requestId?:number;

    sampleCode:string;

    sampleName:string;

    employee:string;

    currentPhase:string;

    status:string;

}



export interface AddSample{

    sampleName:string;

    customerId:number;

    assignedEmployeeId:number;

}



export interface ApiResponse{

    message:string;

}