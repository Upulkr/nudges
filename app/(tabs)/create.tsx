import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, Alert } from 'react-native';
import { Plus, Trash2, Save, Send } from 'lucide-react-native';
import { YStack, XStack, Text, Input, TextArea, Button, Card, H1, H2, H3, Separator } from 'tamagui';
import { Storage } from '@/utils/storage';
import { Invoice, Customer, InvoiceItem } from '@/types/invoice';
import { TourTooltip } from '@/components/TourTooltip';
import { PulseWrapper } from '@/components/PulseWrapper';
import { useTourStore } from '@/store/tourStore';
import { createTourSteps } from '@/utils/tourSteps';

export default function CreateInvoice() {
  const [customer, setCustomer] = useState<Partial<Customer>>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
  ]);
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');

  const scrollViewRef = useRef<ScrollView>(null);
  const { startTour } = useTourStore();

  useEffect(() => {
    // Start tour automatically when component mounts
    const timer = setTimeout(() => {
      startTour(createTourSteps);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const saveInvoice = async (status: 'draft' | 'sent') => {
    if (!customer.name || !customer.email || items.some(item => !item.description)) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const invoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      customer: customer as Customer,
      items,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal(),
      status,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await Storage.addInvoice(invoice);
    
    // Add customer if new
    const existingCustomers = await Storage.getCustomers();
    if (!existingCustomers.find(c => c.email === customer.email)) {
      await Storage.addCustomer(customer as Customer);
    }

    Alert.alert(
      'Success',
      `Invoice ${status === 'draft' ? 'saved as draft' : 'sent'} successfully!`,
      [{ text: 'OK', onPress: resetForm }]
    );
  };

  const resetForm = () => {
    setCustomer({ name: '', email: '', phone: '', address: '' });
    setItems([{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }]);
    setNotes('');
    setDueDate('');
  };

  return (
    <YStack flex={1} backgroundColor="$gray1">
      {/* Header */}
      <YStack 
        backgroundColor="$background" 
        paddingTop={56} 
        paddingHorizontal="$4" 
        paddingBottom="$4"
        borderBottomWidth={1}
        borderBottomColor="$gray5"
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
        elevation={3}
      >
        <H1 fontSize={32} fontWeight="700" color="$gray12">
          Create Invoice
        </H1>
      </YStack>

      <ScrollView 
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Customer Information */}
        <YStack marginTop="$6">
          <H2 fontSize={20} fontWeight="600" color="$gray12" marginBottom="$4">
            Customer Information
          </H2>
          
          <PulseWrapper elementId="customer-name">
            <YStack marginBottom="$4">
              <Text fontSize={14} fontWeight="500" color="$gray11" marginBottom="$2">
                Name *
              </Text>
              <Input
                value={customer.name}
                onChangeText={(text) => setCustomer({ ...customer, name: text })}
                placeholder="Enter customer name"
                backgroundColor="$background"
                borderColor="$gray6"
                borderRadius="$3"
                paddingHorizontal="$4"
                paddingVertical="$3"
                fontSize={16}
                color="$gray12"
              />
            </YStack>
          </PulseWrapper>
          
          <PulseWrapper elementId="customer-email">
            <YStack marginBottom="$4">
              <Text fontSize={14} fontWeight="500" color="$gray11" marginBottom="$2">
                Email *
              </Text>
              <Input
                value={customer.email}
                onChangeText={(text) => setCustomer({ ...customer, email: text })}
                placeholder="Enter email address"
                keyboardType="email-address"
                backgroundColor="$background"
                borderColor="$gray6"
                borderRadius="$3"
                paddingHorizontal="$4"
                paddingVertical="$3"
                fontSize={16}
                color="$gray12"
              />
            </YStack>
          </PulseWrapper>
          
          <PulseWrapper elementId="customer-phone">
            <YStack marginBottom="$4">
              <Text fontSize={14} fontWeight="500" color="$gray11" marginBottom="$2">
                Phone
              </Text>
              <Input
                value={customer.phone}
                onChangeText={(text) => setCustomer({ ...customer, phone: text })}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                backgroundColor="$background"
                borderColor="$gray6"
                borderRadius="$3"
                paddingHorizontal="$4"
                paddingVertical="$3"
                fontSize={16}
                color="$gray12"
              />
            </YStack>
          </PulseWrapper>
          
          <PulseWrapper elementId="customer-address">
            <YStack marginBottom="$4">
              <Text fontSize={14} fontWeight="500" color="$gray11" marginBottom="$2">
                Address
              </Text>
              <TextArea
                value={customer.address}
                onChangeText={(text) => setCustomer({ ...customer, address: text })}
                placeholder="Enter customer address"
                numberOfLines={3}
                backgroundColor="$background"
                borderColor="$gray6"
                borderRadius="$3"
                paddingHorizontal="$4"
                paddingVertical="$3"
                fontSize={16}
                color="$gray12"
                height={80}
              />
            </YStack>
          </PulseWrapper>
        </YStack>

        {/* Invoice Items */}
        <YStack marginTop="$6">
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
            <H2 fontSize={20} fontWeight="600" color="$gray12">
              Invoice Items
            </H2>
            <PulseWrapper elementId="add-item-btn">
              <Button 
                size="$3"
                circular
                backgroundColor="$green9"
                onPress={addItem}
                shadowColor="$green9"
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.3}
                shadowRadius={8}
                elevation={4}
              >
                <Plus size={20} color="white" />
              </Button>
            </PulseWrapper>
          </XStack>

          {items.map((item, index) => (
            <Card 
              key={item.id}
              backgroundColor="$background"
              borderRadius="$4"
              padding="$5"
              marginBottom="$4"
              borderWidth={1}
              borderColor="$gray5"
              shadowColor="$shadowColor"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.05}
              shadowRadius={4}
              elevation={2}
            >
              <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
                <H3 fontSize={16} fontWeight="600" color="$gray12">
                  Item {index + 1}
                </H3>
                {items.length > 1 && (
                  <PulseWrapper elementId={`remove-item-${item.id}`}>
                    <Button
                      size="$2"
                      backgroundColor="$red2"
                      onPress={() => removeItem(item.id)}
                      borderRadius="$2"
                    >
                      <Trash2 size={16} color="$red9" />
                    </Button>
                  </PulseWrapper>
                )}
              </XStack>

              <PulseWrapper elementId={`item-description-${item.id}`}>
                <YStack marginBottom="$4">
                  <Text fontSize={14} fontWeight="500" color="$gray11" marginBottom="$2">
                    Description *
                  </Text>
                  <Input
                    value={item.description}
                    onChangeText={(text) => updateItem(item.id, 'description', text)}
                    placeholder="Enter item description"
                    backgroundColor="$gray1"
                    borderColor="$gray6"
                    borderRadius="$3"
                    paddingHorizontal="$4"
                    paddingVertical="$3"
                    fontSize={16}
                    color="$gray12"
                  />
                </YStack>
              </PulseWrapper>

              <XStack gap="$3">
                <PulseWrapper elementId={`item-quantity-${item.id}`}>
                  <YStack flex={1}>
                    <Text fontSize={14} fontWeight="500" color="$gray11" marginBottom="$2">
                      Quantity
                    </Text>
                    <Input
                      value={item.quantity.toString()}
                      onChangeText={(text) => updateItem(item.id, 'quantity', parseInt(text) || 0)}
                      placeholder="0"
                      keyboardType="numeric"
                      backgroundColor="$gray1"
                      borderColor="$gray6"
                      borderRadius="$3"
                      paddingHorizontal="$4"
                      paddingVertical="$3"
                      fontSize={16}
                      color="$gray12"
                    />
                  </YStack>
                </PulseWrapper>
                
                <PulseWrapper elementId={`item-rate-${item.id}`}>
                  <YStack flex={1}>
                    <Text fontSize={14} fontWeight="500" color="$gray11" marginBottom="$2">
                      Rate ($)
                    </Text>
                    <Input
                      value={item.rate.toString()}
                      onChangeText={(text) => updateItem(item.id, 'rate', parseFloat(text) || 0)}
                      placeholder="0.00"
                      keyboardType="decimal-pad"
                      backgroundColor="$gray1"
                      borderColor="$gray6"
                      borderRadius="$3"
                      paddingHorizontal="$4"
                      paddingVertical="$3"
                      fontSize={16}
                      color="$gray12"
                    />
                  </YStack>
                </PulseWrapper>
                
                <PulseWrapper elementId={`item-amount-${item.id}`}>
                  <YStack flex={1}>
                    <Text fontSize={14} fontWeight="500" color="$gray11" marginBottom="$2">
                      Amount
                    </Text>
                    <YStack
                      backgroundColor="$green2"
                      borderWidth={1}
                      borderColor="$green6"
                      borderRadius="$3"
                      paddingHorizontal="$4"
                      paddingVertical="$3"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize={16} fontWeight="600" color="$green11">
                        ${item.amount.toFixed(2)}
                      </Text>
                    </YStack>
                  </YStack>
                </PulseWrapper>
              </XStack>
            </Card>
          ))}
        </YStack>

        {/* Invoice Details */}
        <YStack marginTop="$6">
          <H2 fontSize={20} fontWeight="600" color="$gray12" marginBottom="$4">
            Invoice Details
          </H2>
          
          <PulseWrapper elementId="due-date">
            <YStack marginBottom="$4">
              <Text fontSize={14} fontWeight="500" color="$gray11" marginBottom="$2">
                Due Date
              </Text>
              <Input
                value={dueDate}
                onChangeText={setDueDate}
                placeholder="YYYY-MM-DD"
                backgroundColor="$background"
                borderColor="$gray6"
                borderRadius="$3"
                paddingHorizontal="$4"
                paddingVertical="$3"
                fontSize={16}
                color="$gray12"
              />
            </YStack>
          </PulseWrapper>
          
          <PulseWrapper elementId="notes">
            <YStack marginBottom="$4">
              <Text fontSize={14} fontWeight="500" color="$gray11" marginBottom="$2">
                Notes
              </Text>
              <TextArea
                value={notes}
                onChangeText={setNotes}
                placeholder="Additional notes or terms"
                numberOfLines={3}
                backgroundColor="$background"
                borderColor="$gray6"
                borderRadius="$3"
                paddingHorizontal="$4"
                paddingVertical="$3"
                fontSize={16}
                color="$gray12"
                height={80}
              />
            </YStack>
          </PulseWrapper>
        </YStack>

        {/* Invoice Summary */}
        <PulseWrapper elementId="invoice-summary">
          <YStack marginTop="$6">
            <H2 fontSize={20} fontWeight="600" color="$gray12" marginBottom="$4">
              Invoice Summary
            </H2>
            <Card
              backgroundColor="$background"
              borderRadius="$4"
              padding="$5"
              borderWidth={1}
              borderColor="$gray5"
              shadowColor="$shadowColor"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.05}
              shadowRadius={4}
              elevation={2}
            >
              <XStack justifyContent="space-between" alignItems="center" paddingVertical="$2">
                <Text fontSize={16} color="$gray10">Subtotal:</Text>
                <Text fontSize={16} fontWeight="500" color="$gray12">
                  ${calculateSubtotal().toFixed(2)}
                </Text>
              </XStack>
              <XStack justifyContent="space-between" alignItems="center" paddingVertical="$2">
                <Text fontSize={16} color="$gray10">Tax (10%):</Text>
                <Text fontSize={16} fontWeight="500" color="$gray12">
                  ${calculateTax().toFixed(2)}
                </Text>
              </XStack>
              <Separator marginVertical="$3" />
              <XStack justifyContent="space-between" alignItems="center" paddingVertical="$2">
                <Text fontSize={18} fontWeight="600" color="$gray12">Total:</Text>
                <Text fontSize={20} fontWeight="700" color="$green10">
                  ${calculateTotal().toFixed(2)}
                </Text>
              </XStack>
            </Card>
          </YStack>
        </PulseWrapper>

        {/* Action Buttons */}
        <XStack gap="$3" marginTop="$8">
          <PulseWrapper elementId="save-draft-btn">
            <Button
              flex={1}
              backgroundColor="$background"
              borderWidth={1}
              borderColor="$gray6"
              onPress={() => saveInvoice('draft')}
              shadowColor="$shadowColor"
              shadowOffset={{ width: 0, height: 1 }}
              shadowOpacity={0.05}
              shadowRadius={2}
              elevation={1}
            >
              <XStack alignItems="center" gap="$2">
                <Save size={20} color="$gray10" />
                <Text fontSize={16} fontWeight="600" color="$gray11">
                  Save Draft
                </Text>
              </XStack>
            </Button>
          </PulseWrapper>
          
          <PulseWrapper elementId="send-invoice-btn">
            <Button
              flex={1}
              backgroundColor="$blue9"
              onPress={() => saveInvoice('sent')}
              shadowColor="$blue9"
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.3}
              shadowRadius={8}
              elevation={4}
            >
              <XStack alignItems="center" gap="$2">
                <Send size={20} color="white" />
                <Text fontSize={16} fontWeight="600" color="white">
                  Send Invoice
                </Text>
              </XStack>
            </Button>
          </PulseWrapper>
        </XStack>

        <YStack height={120} />
      </ScrollView>

      <TourTooltip />
    </YStack>
  );
}