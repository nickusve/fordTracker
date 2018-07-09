const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: "",
		pass: ""
	}
});

var mailOptions = {
	from: "",
	to: "",
	subject: 'Ford Build Update',
	html: ''
};

module.exports = {
	configureApi: function(configData){

		transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: configData.gmailAuth.email,
				pass:  configData.gmailAuth.appPassword
			}
		});

		mailOptions.from = configData.gmailAuth.email;
		mailOptions.to = configData.notificationEmail;
	},
	sendEmail: function(message){

		mailOptions.html = message;

		transporter.sendMail(mailOptions, function (err, info) {
			if(err)
			{
				console.log(err)
			}
		});
	},
	sendUpdate: function(data){

		mailOptions.html = "<h1>" + data.vehicleName + " status update!" +
		"</h1><br><br><h2>Order Information:</h2><br>" +
		"<b>Vehicle</b>: " + data.vehicleName + "<br>" +
		"<b>Order Date</b>: " + data.vechileOrderDate + "<br>" +
		"<b>Order Number</b>: " + data.vehicleOrderNumber + "<br>" +
		"<b>VIN</b>: " + data.vehicleVin + "<br><br>" +
		"<h2>Current Status:</h2><br>" +
		"<b>Build Status</b>: " + data.vehicleStatus + "<br>" +
		"<b>Current Status Progresss</b>: " + data.currentStatusPercent + 
		"<br><b>Estimated Delivery Date</b>: " +
		data.vehicleEstimatedDate + "<br>" +
		"<b>Days Until Delivery</b>: " + data.vehicleDaysToDelivery + "<br>" +
		(data.vehicleDelivered ? "<br><b>Your vehicle has been delivered!</b>"
			: "");

		transporter.sendMail(mailOptions, function (err, info) {
			if(err)
			{
				console.log(err)
			}
		});
	}
}
