import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { CreateAnswerDto } from '../dto/createAnswer.dto';
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

  constructor(user: User, survey: Survey, { ...props }: CreateAnswerDto) {
    this.checkAnswers(survey, props.answers);
    this.answer = props.answers;
    this.owner = user;
    this.survey = survey;
  }

  private checkAnswers(survey: Survey, answers: AnswerProp[]): void {
    const questions = survey.questions;

    console.log(`checking if the answeres are correct`);

    questions.forEach((question, index) => {
      const questionAnswer: AnswerProp = answers.find((answer) => {
        return Number(answer.question_key) == index;
      });

      if (question.required && !!questionAnswer.option_key) {
        throw new Error('Existem perguntas obrigatórios não respondidas');
      }
    });
  }
}

export interface AnswerProp {
  question_key: number;
  option_key: number;
  option_text: string;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
