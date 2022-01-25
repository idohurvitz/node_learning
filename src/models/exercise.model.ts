import mongoose, { Document, Schema } from 'mongoose';

interface ExerciseInterface extends Document {
  userId: string;
  duration: number;
  description: string;
  date: Date;
}

const ExerciseSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    duration: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true }
  },
  {
    timestamps: false // for the exercise design will implements my self
  }
);

export default mongoose.model<ExerciseInterface>('Exercise', ExerciseSchema);
