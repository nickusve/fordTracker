const cheerio = require('cheerio')
const request = require('request')
const fileIo = require('./fileIo.js')
const emailApi = require('./emailApi.js')

// Load the customer info and automation settings
var requestData = fileIo.importCustomerInfo();
var automationData = fileIo.importAutomationInfo();

// Set up the email API
emailApi.configureApi(automationData);

setInterval(function(){
	request.post(
		'http://www.cotus.ford.com/',
		{form: requestData},
		function (error, response, body) {
			if (!error && response.statusCode == 200) {

				const $ = cheerio.load(body)

				if ($("#ng-widget-1").hasClass("landing"))
				{
					console.log("Filed to load vehicle status - vehicle information may be incorrect.");
					return;
				}

			// Emptry data container for vehicle/status info
			var data = {};

			data.vehicleName = $(".vehicleName").text();
			data.vechileOrderDate = $(".orderDate").text();
			data.vehicleOrderNumber = $(".orderNumber").text();
			data.vehicleVin = $(".vin").text();
			data.vehicleEstimatedDate = $("#hidden-estimated-delivery-date").prop("data-part");
			data.vehicleStatus = $(".NavTab .active").find(".step-label").text();
			data.currentStatusPercent = $(".NavTab .progress-bar-fill").css("width"),
			data.vehicleDaysToDelivery = $("#finalDaysLeft .days").text(),
			data.vehicleDelivered = ($("li#DELIVERED div.complete") && ($("li#DELIVERED div.complete").length > 0));

			var currentStatus = fileIo.importCurrentInfo();

			if(JSON.stringify(data) === JSON.stringify(currentStatus))
			{
				console.log("No new information");
			} else
			{
				console.log("New information!");
				console.log(data);
				fileIo.exportCurrentInfo(data);
				emailApi.sendUpdate(data);
			}
		}
	}
	)
}	, ((automationData.checkFrequency.hours * 3600000) +
	(automationData.checkFrequency.minutes * 60000) +
	(automationData.checkFrequency.seconds * 1000)));