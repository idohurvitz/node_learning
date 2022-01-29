import mongoose, { Document, Schema } from 'mongoose';
import exerciseInterface from '../interfaces/exercise.interface';

const ExerciseSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    duration: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true }
  },
  {
    timestamps: false, // for the exercise design will implements my self
    versionKey: false
  }
);

export default mongoose.model<exerciseInterface>('Exercise', ExerciseSchema);
