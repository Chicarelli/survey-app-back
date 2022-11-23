import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type SurveyDocument = HydratedDocument<Survey>;

@Schema()
export class Survey {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  owner: User;

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ default: true })
  isUniqueAnswer: boolean;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  finalDate: string;

  @Prop()
  limitAnswer: number;

  @Prop({ default: [] })
  questions: Question[];
}

export const SurveySchema = SchemaFactory.createForClass(Survey);

interface Question {
  question: string;
  answers: string[];
  required: boolean;
}
