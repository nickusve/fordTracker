const fs = require("fs");

function() {
	function importCustomerInfo (file)
	{
		// Read the information file
		var customerInformation = fs.readFileSync("information.json");

		// If a VIN of correct length is provided use it as the input
		if(17 === customerInformation.vin.length)
		{
			customerInformation.orderTrackingInputType = "vin";
		} else
		{
			// Otherwise use the order information
			customerInformation.orderTrackingInputType = "orderNumberInput";
		}

		return customerInformation;

	}

	export {
		importCustomerInfo: importCustomerInfo
	}
}();