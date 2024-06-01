import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserType = {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    }; // Define a type for the user model

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
}); // Create a schema

userSchema.pre('save', async function (next) {
    if (this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8);
    } // Hash the password before saving the user model
    next(); // Call the next middleware
});

const User = mongoose.model<UserType>('User', userSchema); // Create a model from the schema

export default User;