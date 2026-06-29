export interface AttendanceRecord {

  id: number;

  employeeName: string;

  date: string;

  checkIn: string;

  checkOut?: string;

  status: string;

}



export interface AttendanceSummary {

  present: number;

  absent: number;

  leave: number;

  halfDay: number;

  total: number;

}



export interface MarkAttendance {

  employeeId: number;

  checkIn: string;

  status: string;

}