import * as yup from 'yup';

export const createBlackCardSchema = yup.object({
  deckId: yup.number().required(), // deck that card should belong to.
  text: yup.string().required(),
})

export const createWhiteCardSchema = yup.object({
  deckId: yup.number().required(), // deck that card should belong to.
  text: yup.string().required(),
  type: yup.string().oneOf(['noun', 'verb', 'definite', 'unknown']).default('unknown')
})