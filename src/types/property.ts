export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    properties: number;
  };
}

export interface LandlordSummary {
  id: string;
  name: string;
  email?: string;
  phone?: string | null;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  area?: string | null;
  city: string;
  country: string;
  monthlyRent: number | string;
  securityDeposit?: number | string | null;
  bedrooms: number;
  bathrooms: number;
  areaSqFt?: number | null;
  amenities: string[];
  images: string[];
  status: "AVAILABLE" | "RENTED" | "UNAVAILABLE";
  availableFrom?: string | null;
  categoryId: string;
  landlordId: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  landlord?: LandlordSummary;
  _count?: {
    rentalRequests?: number;
    reviews?: number;
  };
}

export interface PropertyFilterParams {
  search?: string;
  city?: string;
  area?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "monthlyRent";
  sortOrder?: "asc" | "desc";
}
