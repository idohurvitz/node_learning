import mongoose, { Document, Schema } from 'mongoose';
interface UserInterface extends Document {
  username: string;
  _id: string;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true }
  },
  {
    timestamps: false, // for the exercise design will implements my self
    versionKey: false
  }
);

export default mongoose.model<UserInterface>('User', UserSchema);
