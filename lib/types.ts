export type BicycleCategory = "VTT" | "City" | "Electric"

export type ReservationStatus = "Pending" | "Confirmed" | "Annulled"

export interface Bicycle {
  id: string
  name: string
  price: number
  category: BicycleCategory
}

export interface Reservation {
  id: string
  customerName: string
  phoneNumber: string
  duration: number
  reservationDate: string
  bicycleCategory: BicycleCategory
  status: ReservationStatus
}
