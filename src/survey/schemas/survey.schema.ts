import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type SurveyDocument = HydratedDocument<Survey>;

@Schema()
export class Survey {
  _id: string;

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

  constructor({
    owner,
    isPublic,
    isUniqueAnswer,
    title,
    description,
    finalDate,
    limitAnswer,
    questions,
  }) {
    this.owner = owner;
    this.isPublic = isPublic;
    this.isUniqueAnswer = isUniqueAnswer;
    this.description = description;
    this.limitAnswer = limitAnswer;
    this.setTitle(title);
    this.setQuestions(questions);
    this.setFinalDate(finalDate);
  }

  setQuestions(questions: Question[]) {
    this.isQuestionsValid(questions);

    this.questions = questions;
  }

  public setFinalDate(finalDate): void {
    const date = new Date(finalDate);

    if (isNaN(Number(date)) || !finalDate) {
      this.finalDate = null;
    }

    this.finalDate = date.toString();
  }

  public setTitle(title: string) {
    if (title.replace(/\s/g, '').length === 0) {
      throw new Error('Nome inválido');
    }

    this.title = title;
  }

  private isQuestionsValid(questions: Question[]): void {
    console.log(`Checking if it is a valid survey`);
    this.checkIfThereIsMinimumQuestions(questions.length);
    this.checkEmptyQuestions(questions);
    this.checkQuestionsAnswers(questions);
  }

  private checkIfThereIsMinimumQuestions(
    questions: number | Array<Question>,
  ): void {
    console.log(`Checking if there is a Minimum question`);
    const MINIMUM_QUESTION = 2;
    let numberOfQuestions: number;

    if (typeof questions === 'object') {
      numberOfQuestions = questions.length;
    } else {
      numberOfQuestions = Number(questions);
    }

    if (numberOfQuestions < MINIMUM_QUESTION)
      throw new Error('Pesquisa tem que ter pelo menos duas questões');
  }

  private checkEmptyQuestions(questions: Array<Question>): void {
    console.log(`Checking if there is some empty question`);
    questions.forEach((question) => {
      if (
        !question.question ||
        question.question.replace(/\s/g, '').length == 0
      ) {
        throw new Error('Questões vazias não são permitidas');
      }
    });
  }

  private checkQuestionsAnswers(questions: Array<Question>): void {
    console.log(`Cheking questions answers`);
    questions.forEach((question) => {
      if (question.answers.length < 2) {
        throw new Error('Questões precisam ter pelo menos duas alternativas');
      }
    });
  }
}

export const SurveySchema = SchemaFactory.createForClass(Survey);

interface Question {
  question: string;
  answers: string[];
  required: boolean;
}
