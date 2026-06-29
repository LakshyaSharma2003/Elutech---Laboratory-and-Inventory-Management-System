public static class EmailTemplates
{


    public static string SampleApproved(

    string sample)
    {


        return $@"

Sample


{sample}


Approved


";


    }




    public static string SalaryPaid(

    decimal salary)
    {


        return $@"

Salary Credited


₹{salary}


";


    }



}