import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../lib/api';
import { AppDispatch } from './index';
import { Listing, Seller, ListingState, FetchListingsParams } from '@/types';
import { AxiosError } from 'axios';


const initialState: ListingState = {
  listings: [],
  featuredListings: [],
  currentListing: null,
  currentSeller: null,
  loading: false,
  uploadLoading: false,
  error: null,
  successMessage: null,
  totalPages: 1,
  currentPage: 1,
};

export const addListing = createAsyncThunk(
  'listing/addListing',
  async (listingData: Omit<Listing, '_id' | 'createdAt' | 'seller'>, { rejectWithValue }) => {
    try {
      const response = await api.post('/listings', listingData);
      return response.data;
    } catch (error: unknown) {
      let message = "Failed to add listing.";
      if (error instanceof AxiosError && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const uploadListingImage = createAsyncThunk(
  'listing/uploadListingImage',
  async (imageData: FormData, { rejectWithValue }) => {
    try {
      const response = await api.post('/upload/image', imageData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: unknown) {
      let message = "Failed to upload image.";
      if (error instanceof AxiosError && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const fetchListings = createAsyncThunk(
  'listing/fetchListings',
  async (params: FetchListingsParams = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/listings`, { params });
      return response.data;
    } catch (error: unknown) {
      let message = "Failed to fetch listings.";
      if (error instanceof AxiosError && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const fetchFeaturedListings = createAsyncThunk(
  'listing/fetchFeaturedListings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/listings/featured');
      return response.data;
    } catch (error: unknown) {
      let message = "Failed to fetch featured listings.";
      if (error instanceof AxiosError && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const fetchListingDetails = createAsyncThunk(
  'listing/fetchListingDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<Listing>(`/listings/${id}`);
      return response.data;
    } catch (error: unknown) {
      let message = "Failed to fetch listing details.";
      if (error instanceof AxiosError && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const updateListing = createAsyncThunk(
  'listing/updateListing',
  async ({ id, listingData }: { id: string; listingData: Omit<Listing, '_id' | 'createdAt' | 'seller'> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/listings/${id}`, listingData);
      return response.data;
    } catch (error: unknown) {
      let message = "Failed to update listing.";
      if (error instanceof AxiosError && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

const listingSlice = createSlice({
  name: 'listing',
  initialState,
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
    clearCurrentListing(state) {
      state.currentListing = null;
      state.currentSeller = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addListing.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(addListing.fulfilled, (state, action: PayloadAction<Listing>) => {
        state.loading = false;
        state.successMessage = "Listing added successfully!";
        state.listings.push(action.payload);
      })
      .addCase(addListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateListing.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateListing.fulfilled, (state, action: PayloadAction<Listing>) => {
        state.loading = false;
        state.successMessage = "Listing updated successfully!";
        const index = state.listings.findIndex(listing => listing._id === action.payload._id);
        if (index !== -1) {
          state.listings[index] = action.payload;
        }
      })
      .addCase(updateListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadListingImage.pending, (state) => {
        state.uploadLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(uploadListingImage.fulfilled, (state, action) => {
        state.uploadLoading = false;
        // Do not set successMessage here to prevent form reset in AddListing.tsx
        // state.successMessage = "Image uploaded successfully!"; 
      })
      .addCase(uploadListingImage.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action: PayloadAction<{ listings: Listing[]; totalPages: number; currentPage: number }>) => {
        state.loading = false;
        state.listings = action.payload.listings;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFeaturedListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedListings.fulfilled, (state, action: PayloadAction<Listing[]>) => {
        state.loading = false;
        state.featuredListings = action.payload;
      })
      .addCase(fetchFeaturedListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchListingDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentListing = null;
        state.currentSeller = null;
      })
      .addCase(fetchListingDetails.fulfilled, (state, action: PayloadAction<Listing>) => {
        state.loading = false;
        state.currentListing = action.payload;
        // Assuming the ListingSeller interface has enough info to populate currentSeller
        // If not, you might need to fetch full seller details separately or adjust types
        state.currentSeller = {
          _id: action.payload.seller._id,
          name: action.payload.seller.fullName,
          avatar: action.payload.seller.profile.avatarUrl || "", // Use actual avatarUrl
          rating: 0, // Placeholder
          totalSales: action.payload.seller.sellerStats?.totalSales || 0,
        };
      })
      .addCase(fetchListingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentListing = null;
        state.currentSeller = null;
      });
  },
});

export const { clearMessages, clearCurrentListing } = listingSlice.actions;
export default listingSlice.reducer;
