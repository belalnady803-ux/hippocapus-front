import { useCallback } from 'react';

const useWhatsApp = (phoneNumber) => {
  /**
   * Returns a memoized function to open a WhatsApp chat.
   * @param message - The message to pre-fill.
   */
  const openWhatsApp = useCallback((message) => {
    if (!message || message.trim() === '') {
      console.error("WhatsApp message cannot be empty.");
      return;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');
  }, [phoneNumber]); // The function is re-created only if phoneNumber changes

  return { openWhatsApp };
};

export default useWhatsApp;
