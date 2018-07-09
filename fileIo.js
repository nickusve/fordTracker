const fs = require("fs");

function createNewCustomerInfo(){
	fs.writeFileSync("information.json", JSON.stringify({
		orderNumber: "",
		dealerCode : "",
		customerLastName :  "",
		vin : ""
	}, null, 4));
}

module.exports = {
	importCustomerInfo: function(){
		// Create a new info file if not found
		if(!fs.existsSync("information.json"))
		{
			createNewCustomerInfo();
		}

		// Read the information file
		var customerInformation = JSON.parse(fs.readFileSync("information.json"));

		customerInformation.freshLoaded = true;

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
	},
	importCurrentInfo: function(){
		// Read current status file if it exists, otherwise return a blank obj
		if(fs.existsSync("currentStatus.json"))
		{
			return JSON.parse(fs.readFileSync("currentStatus.json"));
		} else
		{
			return {};
		}
	},
	exportCurrentInfo: function(data){
		// Write current status to file
		fs.writeFileSync("currentStatus.json", JSON.stringify(data, null, 4));
	}
}
