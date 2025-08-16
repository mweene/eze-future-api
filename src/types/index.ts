// Database table interfaces
export interface ClientDB {
  id: number;
  name: string;
  sex: string | null;
  nrc: string | null;
  phone: string | null;
  email: string;
  address: string | null;
}

export interface PlotDetailsDB {
  id: number;
  client_id: number;
  plot_size: string | null;
  plot_number: string | null;
  site_name: string | null;
  grand_price: number | null;
  amount_paid: number | null;
  balance: number | null;
  allocated: string | null;
  allocation_date: string | null;
  payment_status: string | null;
  date_bought: string | null;
  date_updated: string | null;
}

export interface WitnessDB {
  id: number;
  client_id: number;
  name: string | null;
  sex: string | null;
  nrc: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  relationship: string | null;
}

export interface DocumentsDB {
  id: number;
  client_id: number;
  nrc_link: string | null;
  letter_of_sale_link: string | null;
  land_agreement_link: string | null;
  allocation_form_link: string | null;
  authorization_letter_link: string | null;
}

// API request/response interfaces
export interface PlotDetails {
  plotSize?: string;
  plotNumber?: string;
  siteName?: string;
  grandPrice?: number;
  amountPaid?: number;
  balance?: number;
  allocated?: string;
  allocationDate?: string;
  paymentStatus?: string;
  dateBought?: string;
  dateUpdated?: string;
}

export interface Witness {
  name?: string;
  sex?: string;
  nrc?: string;
  email?: string;
  phone?: string;
  address?: string;
  relationship?: string;
}

export interface Documents {
  nrcLink?: string;
  letterOfSaleLink?: string;
  landAgreementLink?: string;
  allocationFormLink?: string;
  authorizationLetterLink?: string;
}

export interface ClientRequest {
  name: string;
  sex?: string;
  nrc?: string;
  phone?: string;
  email: string;
  address?: string;
  plotDetails?: PlotDetails;
  witness?: Witness;
  documents?: Documents;
}

export interface ClientResponse {
  id: string | number;
  name: string;
  sex?: string;
  nrc?: string;
  phone?: string;
  email: string;
  address?: string;
  plotDetails?: PlotDetails;
  witness?: Witness;
  documents?: Documents;
}
