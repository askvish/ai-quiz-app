export interface ResponseModel {
  id: string
  message: Message
  finish_reason: string
  usage: Usage
}

export interface Message {
  role: string
  content: Content[]
}

export interface Content {
  type: string
  text: string
}

export interface Usage {
  billed_units: BilledUnits
  tokens: Tokens
}

export interface BilledUnits {
  input_tokens: number
  output_tokens: number
}

export interface Tokens {
  input_tokens: number
  output_tokens: number
}
