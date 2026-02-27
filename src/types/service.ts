export type ServiceCategory =
  | 'grundpflege'
  | 'behandlungspflege'
  | 'hauswirtschaft'
  | 'demenz'
  | 'palliativ'
  | 'verhinderung'
  | 'beratung'
  | 'nacht'

export type ServiceIcon =
  | 'heart-handshake'
  | 'syringe'
  | 'home'
  | 'brain'
  | 'dove'
  | 'refresh'
  | 'message-circle'
  | 'moon'

export interface ServiceHighlight {
  point: string
  id?: string
}

export interface Service {
  id: string
  title: string
  category: ServiceCategory
  icon: ServiceIcon
  shortDescription: string
  description?: unknown // Payload RichText
  highlights?: ServiceHighlight[]
  kassenleistung: boolean
  order: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ServicesResponse {
  docs: Service[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
}
