import mongoose, { Document, Schema } from 'mongoose';
interface UrlInterface extends Document {
  url: string;
  short_url: number;
}

export const UrlSchema: Schema = new Schema(
  {
    url: { type: String, required: true },
    short_url: { type: Number }
  },
  {
    timestamps: false, // for the exercise design will implements my self
    versionKey: false
  }
);
const UrlModel = mongoose.model<UrlInterface>('Url', UrlSchema); // for actual application we can  use the mongoose middleware here - wrap the db actions

export default UrlModel;
