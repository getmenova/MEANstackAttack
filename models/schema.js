var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var StockSchema = new mongoose.Schema({ //require data types for each field we want to display
	Name: String,
	Symbol: String,
	LastPrice: Number,
	Change: Number,
	ChangePercent: Number,
	Timestamp: String,
	MSDate: Number,
	MarketCap: Number,
	Volume: Number,
	ChangeYTD: Number,
	ChangePercentYTD: Number,
	High: Number,
	Low: Number,
	Open: Number
}, {
	collection: 'Stocks'
});
var Stock = mongoose.model('Stock', StockSchema);
//purchases
var PurchasedSchema = new mongoose.Schema({
	userEmail: String,
	stock: StockSchema,
	quantity: Number,
}, {
	collection: 'Purchased'
});
var Purchased = mongoose.model('Purchased', PurchasedSchema);
// logging users
var UserSchema = new mongoose.Schema({
	name: String,
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	watchlist: [String],
	purchased: [PurchasedSchema]
}, {
	collection: 'Users'
});
UserSchema.set('toJSON', {
	transform: function(doc, ret, options) {
		var returnJson = {
			id: ret._id,
			email: ret.email,
			name: ret.name
		}
		return returnJson;
	}
});
UserSchema.methods.authenticated = function(password) {
	var user = this;
	var isAuthenticated = bcrypt.compareSync(password, user.password);
	return isAuthenticated ? user : false;
}
UserSchema.pre('save', function(next) {
	if (!this.isModified('password')) {
		// build in pw reset if = original, dnc:
		next();
	} else {
		// if password is changed then hash:
		this.password = bcrypt.hashSync(this.password, 10);
		next();
	}
})
var User = mongoose.model('User', UserSchema);
//exporting
module.exports = {
	Stock: Stock,
	Purchased: Purchased,
	User: User
};

// https://www.npmjs.com/package/bcrypt for secure pw hashing/storage