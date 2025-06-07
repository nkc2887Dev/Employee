import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isLoading: boolean;
  toast: {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  };
}

const initialState: UIState = {
  isLoading: false,
  toast: {
    show: false,
    message: '',
    type: 'info',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    showToast: (state, action: PayloadAction<Omit<typeof initialState.toast, 'show'>>) => {
      state.toast = {
        ...action.payload,
        show: true,
      };
    },
    hideToast: (state) => {
      state.toast = initialState.toast;
    },
  },
});

export const { setLoading, showToast, hideToast } = uiSlice.actions;
export default uiSlice.reducer;
