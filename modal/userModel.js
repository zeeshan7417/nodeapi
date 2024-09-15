const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim:true, unique:true,
  },
  password: {
    type: String,
    required: true
  },
  isAdmin:{
      type:Boolean,
      default:false,
  },
  date: {
    type: Date,
    default: Date.now
  }
});
UserSchema.virtual('fullName').
  get(function() { return `${this.firstName} ${this.lastName}`; }).
  set(function(v) {
    // `v` is the value being set, so use the value to set
    // `firstName` and `lastName`.
    const firstName = v.substring(0, v.indexOf(' '));
    const lastName = v.substring(v.indexOf(' ') + 1);
    this.set({ firstName, lastName });
  });


const User = mongoose.model('createUser', UserSchema);

module.exports = User;