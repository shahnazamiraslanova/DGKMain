// globals.d.ts
interface Navigator {
    usb: {
      requestDevice: (options: { filters: Array<{ vendorId: number; productId?: number }> }) => Promise<any>;
      // Add other WebUSB methods here if needed
    };
  }
  