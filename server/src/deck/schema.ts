import * as yup from 'yup';

export const inviteUserSchema = yup.object({
  cardDeckId: yup.number().required(),
  userId: yup.number().required(),
});
export interface InviteUserInput {
  cardDeckId: number;
  userId: number;
}

export const addToLibSchema = yup.object({
  cardDeckId: yup.number().required(),
})
export interface AlterLibInput {
  cardDeckId: number;
}

export const updateDeckSchema = yup.object({
  name: yup.string(),
  description: yup.string(),
  public: yup.boolean(),
  owner: yup.number(),
})
export interface UpdateDeckInput {
  name?: string
  description?: string
  public?: boolean
  owner?: number
}