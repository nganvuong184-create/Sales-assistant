
export interface Specialty {
  id: string;
  name: string;
  vietnameseName: string;
  description: string;
  image: string;
  tags: string[];
  price?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: string;
  description?: string;
  category: string;
}

export interface HotelRoom {
  id: string;
  type: string;
  amenities: string[];
  price: string;
  image: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface OrderRequest {
  id: string;
  vietnameseSummary: string;
  timestamp: Date;
  status: 'pending' | 'completed';
}
