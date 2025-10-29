import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../lib/api';
import { AppDispatch } from './index';
import { Listing, Seller, ListingState } from '@/types';





const initialState: ListingState = {
  listings: [],
  featuredListings: [],
  currentListing: null,
  currentSeller: null,
  loading: false,
  uploadLoading: false,
  error: null,
  successMessage: null,
};

export const addListing = createAsyncThunk(
  'listing/addListing',
  async (listingData: Omit<Listing, '_id' | 'createdAt' | 'seller'>, { rejectWithValue }) => {
    try {
      const response = await api.post('/listings', listingData);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Failed to add listing.";
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
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Failed to upload image.";
      return rejectWithValue(message);
    }
  }
);

export const fetchListings = createAsyncThunk(
  'listing/fetchListings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/listings`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Failed to fetch listings.";
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
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Failed to fetch featured listings.";
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
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Failed to fetch listing details.";
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
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Failed to update listing.";
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
        state.successMessage = "Image uploaded successfully!";
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
          totalSales: 0, // Placeholder
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
