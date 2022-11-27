import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Survey } from './survey.schema';

export type AnswerDocument = HydratedDocument<Answer>;

@Schema()
export class Answer {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'survey' })
  survey: Survey;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  owner: User;

  @Prop()
  connectionId: string;

  @Prop({ default: [] })
  answer: AnswerProp[];
}

export interface AnswerProp {
  question_key: number;
  option_key: number;
  option_text: string;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
