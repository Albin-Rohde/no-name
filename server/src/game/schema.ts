import * as yup from 'yup';

export const createSchema = yup.object({
  playCards: yup.number().required(),
  rounds: yup.number().required(),
  playerLimit: yup.number().required(),
  private: yup.boolean().required(),
  cardDeck: yup.number().required(),
});
export interface CreateInput extends yup.Asserts<typeof createSchema> {}

export const joinSchema = yup.object({
  key: yup.string().required(),
});
