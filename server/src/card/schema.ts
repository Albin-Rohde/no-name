import * as yup from 'yup';

export const createBlackCardSchema = yup.object({
  deckId: yup.number().required(), // deck that card should belong to.
  text: yup.string().required(),
})

export const createManyBlackCardSchema = yup.object({
  cards: yup.array(yup.object({
    id: yup.number().default(undefined),
    text: yup.string().required(),
  })).required(),
  deckId: yup.number().required(),
})

export const createWhiteCardSchema = yup.object({
  deckId: yup.number().required(), // deck that card should belong to.
  text: yup.string().required(),
  type: yup.string().oneOf(['noun', 'verb', 'definite', 'unknown']).default('unknown')
})

export const createManyWhiteCardSchema = yup.object({
  cards: yup.array(yup.object({
    id: yup.number().default(undefined),
    text: yup.string().required(),
    type: yup.string().oneOf(['noun', 'verb', 'definite', 'unknown']).default('unknown')
  })).required(),
  deckId: yup.number().required(),
})