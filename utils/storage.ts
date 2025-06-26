import AsyncStorage from '@react-native-async-storage/async-storage';
import { Invoice, Customer } from '@/types/invoice';

const INVOICES_KEY = '@invoices';
const CUSTOMERS_KEY = '@customers';
const ONBOARDING_KEY = '@onboarding_completed';

export const Storage = {
  // Invoices
  async getInvoices(): Promise<Invoice[]> {
    try {
      const data = await AsyncStorage.getItem(INVOICES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting invoices:', error);
      return [];
    }
  },

  async saveInvoices(invoices: Invoice[]): Promise<void> {
    try {
      await AsyncStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
    } catch (error) {
      console.error('Error saving invoices:', error);
    }
  },

  async addInvoice(invoice: Invoice): Promise<void> {
    const invoices = await this.getInvoices();
    invoices.push(invoice);
    await this.saveInvoices(invoices);
  },

  async updateInvoice(updatedInvoice: Invoice): Promise<void> {
    const invoices = await this.getInvoices();
    const index = invoices.findIndex(inv => inv.id === updatedInvoice.id);
    if (index !== -1) {
      invoices[index] = updatedInvoice;
      await this.saveInvoices(invoices);
    }
  },

  async deleteInvoice(invoiceId: string): Promise<void> {
    const invoices = await this.getInvoices();
    const filtered = invoices.filter(inv => inv.id !== invoiceId);
    await this.saveInvoices(filtered);
  },

  // Customers
  async getCustomers(): Promise<Customer[]> {
    try {
      const data = await AsyncStorage.getItem(CUSTOMERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting customers:', error);
      return [];
    }
  },

  async saveCustomers(customers: Customer[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
    } catch (error) {
      console.error('Error saving customers:', error);
    }
  },

  async addCustomer(customer: Customer): Promise<void> {
    const customers = await this.getCustomers();
    customers.push(customer);
    await this.saveCustomers(customers);
  },

  // Onboarding
  async isOnboardingCompleted(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(ONBOARDING_KEY);
      return data === 'true';
    } catch (error) {
      return false;
    }
  },

  async setOnboardingCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (error) {
      console.error('Error setting onboarding completed:', error);
    }
  },

  async resetOnboarding(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  }
};