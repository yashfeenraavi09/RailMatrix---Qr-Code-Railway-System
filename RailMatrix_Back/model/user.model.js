import mongoose from 'mongoose';

const roleOptions = ["Depot staff", "Senior officials"];

const userSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: roleOptions,
    required: true,
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
