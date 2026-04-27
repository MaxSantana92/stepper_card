import Toast from 'react-native-toast-message';

export function showErrorToast(message: string): void {
  Toast.show({
    type: 'error',
    text1: message,
    position: 'bottom',
  });
}
