export interface ProfitLoss{

    revenue:number;

    expenses:number;

    salaries:number;

    taxes:number;

    profit:number;

}



export interface Invoice{

    id:number;

    invoiceNumber:string;

    customer:string;

    totalAmount:number;

    invoiceDate:string;

    isPaid:boolean;

}



export interface Payment{

    customerId:number;

    amount:number;

    paymentMethod:string;

    referenceNumber:string;

}



export interface Expense{

    title:string;

    amount:number;

    category:string;

    description:string;

}



export interface Salary{

    employeeId:number;

    amount:number;

    month:string;

}



export interface Tax{

    taxName:string;

    amount:number;

}



export interface GenerateInvoice{

    customerId:number;

    amount:number;

    gstPercentage:number;

    notes:string;

}