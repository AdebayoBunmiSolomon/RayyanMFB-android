import { CameraOptions, ImageLibraryOptions } from 'react-native-image-picker';

const cameraOptions: ImageLibraryOptions & CameraOptions = {
  mediaType: 'photo',
  quality: 0.3, // Reduced quality to prevent memory issues
  maxWidth: 800, // Increased max width for better quality
  maxHeight: 800, // Increased max height for better quality
  includeBase64: true,
  cameraType: 'back', // Changed to back camera for better results
  saveToPhotos: false,
  // Add additional safety options
  allowsEditing: false,
  noData: false,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export default cameraOptions;
