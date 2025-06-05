import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isLoading: boolean;
  toast: {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  };
  modal: {
    show: boolean;
    type: string;
    data: any;
  };
}

const initialState: UIState = {
  isLoading: false,
  toast: {
    show: false,
    message: '',
    type: 'info',
  },
  modal: {
    show: false,
    type: '',
    data: null,
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
    showModal: (state, action: PayloadAction<Omit<typeof initialState.modal, 'show'>>) => {
      state.modal = {
        ...action.payload,
        show: true,
      };
    },
    hideModal: (state) => {
      state.modal = initialState.modal;
    },
  },
});

export const { setLoading, showToast, hideToast, showModal, hideModal } = uiSlice.actions;

export default uiSlice.reducer; 