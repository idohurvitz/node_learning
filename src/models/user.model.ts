import mongoose, { Document, Schema } from 'mongoose';
import userInterface from '../interfaces/user.interface';

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true }
  },
  {
    timestamps: false, // for the exercise design will implements my self
    versionKey: false
  }
);

export default mongoose.model<userInterface>('User', UserSchema);
